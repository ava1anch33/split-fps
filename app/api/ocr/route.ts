import { NextResponse } from 'next/server'
import Tesseract from 'tesseract.js'

export function parseOcrLine(line: string) {
    // pre process common OCR errors: O -> 0, I/l -> 1, remove spaces and currency symbols
    const cleaned = line
        .replace(/[Oo]/g, '0')
        .replace(/[slIL|]/g, '1')
        .replace(/,/g, '.')
        .trim()

    const matches = cleaned.match(/\d+[\d.]+/g)

    if (!matches) return null

    // choose the rightmost match as price, to handle cases like "Item 12.34 56.78" where 56.78 is the price
    let rawPrice = matches[matches.length - 1]

    // handle if no dot cases like "1000" which should be "10.00"
    if (!rawPrice.includes('.') && rawPrice.length > 1) {
        rawPrice = rawPrice.slice(0, -2) + '.' + rawPrice.slice(-2)
    }

    const price = parseFloat(rawPrice)

    // get product name by removing the price part from the original line
    const name = line
        .replace(rawPrice, '')
        .replace(/[\d.,$HK]/g, '')
        .trim()

    return {
        name: name || 'unknown item',
        price: isNaN(price) ? 0 : price,
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: '未上傳圖片' }, { status: 400 })
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const text = await (async () => {
            const worker = await Tesseract.createWorker('chi_tra')
            const {
                data: { text },
            } = await worker.recognize(buffer)
            await worker.terminate()
            return text
        })()

        const lines = text.split('\n')
        const potentialItems = lines
            .map((line, index) => {
                const result = parseOcrLine(line)
                if (!result) return null
                const { name, price } = result

                return {
                    id: `ocr-${index}`,
                    name,
                    price,
                }
            })
            .filter((item) => item && item.price > 0)

        return NextResponse.json({
            success: true,
            items: potentialItems,
            rawText: text,
        })
    } catch (error) {
        console.error('OCR Error:', error)
        return NextResponse.json({ error: 'OCR Failed' }, { status: 500 })
    }
}
