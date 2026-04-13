function crc16(str: string): string {
    let crc = 0xffff
    for (let i = 0; i < str.length; i++) {
        crc ^= str.charCodeAt(i) << 8
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) {
                crc = (crc << 1) ^ 0x1021
            } else {
                crc <<= 1
            }
        }
    }
    return (crc & 0xffff).toString(16).toUpperCase().padStart(4, '0')
}

function buildTLV(tag: string, value: string): string {
    const length = value.length.toString().padStart(2, '0')
    return `${tag}${length}${value}`
}

export function generateFPSPayload(fpsId: string, amount: number): string {
    if (!fpsId) return ''

    const amountStr = amount.toFixed(2)

    const hkiclGUI = buildTLV('00', 'hk.com.hkicl')
    const proxyIdTLV = buildTLV('01', fpsId)
    const merchantAccountInfo = buildTLV('26', hkiclGUI + proxyIdTLV)

    let payload = ''
    payload += buildTLV('00', '01') // Payload Format Indicator
    payload += buildTLV('01', '12') // Point of Initiation Method (static QR code)
    payload += merchantAccountInfo
    payload += buildTLV('52', '0000') // Merchant Category Code (default)
    payload += buildTLV('53', '344') // Transaction Currency (HKD)
    payload += buildTLV('54', amountStr) // Transaction Amount
    payload += buildTLV('58', 'HK') // Country Code
    payload += '6304'
    return payload + crc16(payload)
}
