import { NextResponse } from 'next/server'
import Tesseract from 'tesseract.js'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: '未上傳圖片' }, { status: 400 })
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const {
            data: { text },
        } = await Tesseract.recognize(buffer, 'eng+chi_tra+chi_sim')

        const lines = text.split('\n')
        const potentialItems = lines
            .filter((line) => /\d+/.test(line) && line.length > 2)
            .map((line, index) => {
                const priceMatch = line.match(/(\d+\.\d{2})|(\d{2,})/)
                return {
                    id: `ocr-${index}`,
                    name: line.replace(/[0-9.$]/g, '').trim() || 'unknown item',
                    price: priceMatch ? parseFloat(priceMatch[0]) : 0,
                }
            })
            .filter((item) => item.price > 0)

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
