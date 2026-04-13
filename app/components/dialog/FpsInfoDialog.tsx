'use client'

import { TranslationType } from '@/lib/i18n'
import { Settings } from 'lucide-react'

interface FpsInfoDialogProps {
    t: TranslationType
    fpsId: string
    setFpsId: React.Dispatch<React.SetStateAction<string>>
    setShowSettings: (show: boolean) => void
}

export default function FpsInfoDialog({ t, fpsId, setFpsId, setShowSettings }: FpsInfoDialogProps) {
    function setFpsIdAndStore(value: string) {
        setFpsId(value)
        localStorage.setItem('fpsId', value)
    }
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Settings className="text-brand" /> {t.qr.inBankSetting}
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">
                            {t.qr.fpsIDOrPhone}
                        </label>
                        <input
                            type="text"
                            value={fpsId}
                            onChange={(e) => setFpsIdAndStore(e.target.value)}
                            placeholder={t.qr.ex}
                            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                        <p className="text-xs text-slate-400 mt-1">{t.qr.fpsInfo}</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowSettings(false)}
                    className="w-full mt-6 bg-brand text-white font-bold py-3 rounded-xl hover:bg-brand-dark transition-colors"
                >
                    {t.qr.saveAndClose}
                </button>
            </div>
        </div>
    )
}
