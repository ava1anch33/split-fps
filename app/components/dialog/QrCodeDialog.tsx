'use client'

import { TranslationType } from '@/lib/i18n'
import { QrCode } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

interface QrCodeDialogProps {
    participants: { id: string; name: string }[]
    selectedPersonId: string | null
    fpsId: string
    fpsPayloadString: string
    currentAmount: number
    setSelectedPersonId: React.Dispatch<React.SetStateAction<string | null>>
    t: TranslationType
}

export default function QrCodeDialog({
    participants,
    selectedPersonId,
    fpsId,
    fpsPayloadString,
    currentAmount,
    setSelectedPersonId,
    t,
}: QrCodeDialogProps) {
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white w-full max-w-sm md:max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 flex flex-col items-center animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
                <div className="w-12 h-1 bg-slate-200 rounded-full mb-6 sm:hidden" />

                <h3 className="text-xl md:text-2xl font-bold text-slate-800 text-center">
                    {t.qr.payTo.replace(
                        '{name}',
                        participants.find((p) => p.id === selectedPersonId)?.name || '',
                    )}
                </h3>
                <p className="text-slate-400 text-xs md:text-sm mt-1 mb-6 text-center">
                    {fpsId ? t.qr.useSupportBank : t.qr.setFPSInfoFirst}
                </p>

                <div className="w-56 h-56 md:w-64 md:h-64 bg-white rounded-3xl flex items-center justify-center border-4 border-brand/10 p-4 mb-6 shadow-xl relative">
                    {fpsId ? (
                        <QRCodeSVG
                            value={fpsPayloadString}
                            size={220}
                            level="M"
                            fgColor="#1e293b"
                        />
                    ) : (
                        <div className="text-slate-300 flex flex-col items-center">
                            <QrCode size={80} />
                            <span className="text-sm mt-2 font-bold">{t.qr.invalidQrCode}</span>
                        </div>
                    )}
                    {fpsId && (
                        <div className="absolute top-0 right-0 -mr-2 -mt-2 bg-brand text-white px-3 py-1 rounded-full text-[10px] md:text-xs font-black shadow-md">
                            FPS
                        </div>
                    )}
                </div>

                <div className="w-full bg-slate-50 p-4 rounded-2xl mb-8 border border-slate-100 text-center">
                    <span className="text-slate-500 text-sm font-bold mr-2">{t.qr.amount}</span>
                    <span className="text-brand font-black text-3xl md:text-4xl">
                        HK$ {currentAmount.toFixed(2)}
                    </span>
                </div>

                <button
                    onClick={() => setSelectedPersonId(null)}
                    className="w-full bg-slate-100 text-slate-500 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-colors"
                >
                    {t.common.close}
                </button>
            </div>
        </div>
    )
}
