'use client'

import { LANG_KEYS, Language, TranslationType } from '@/lib/i18n'
import { Receipt, Settings } from 'lucide-react'

interface CustomHeaderProps {
    lang: Language
    setLang: React.Dispatch<React.SetStateAction<Language>>
    t: TranslationType
    setShowSettings: (show: boolean) => void
}

export default function CustomHeader({ lang, setLang, t, setShowSettings }: CustomHeaderProps) {
    return (
        <header className="bg-brand text-white p-6 md:px-10 rounded-b-3xl md:rounded-none shadow-lg sticky top-0 z-30">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                        <Receipt size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold leading-tight">
                            {t.common.title}
                        </h1>
                        <p className="text-[12px] md:text-xs text-brand-50 opacity-80 uppercase tracking-widest">
                            {t.common.subtitle}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowSettings(true)}
                        className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-all border border-white/5 active:scale-95"
                    >
                        <Settings size={18} />
                        <span className="hidden sm:inline text-sm font-bold">
                            {t.qr.inBankSetting}
                        </span>
                    </button>

                    <div className="flex gap-1 bg-black/10 p-1 rounded-lg">
                        {LANG_KEYS.map((lng) => {
                            const key = lng.key as Language
                            return (
                                <button
                                    key={key}
                                    onClick={() => setLang(key)}
                                    className={`px-2 py-1 text-xs rounded-md transition-all ${lang === key ? 'bg-white text-brand font-bold shadow-sm' : 'text-white/70'}`}
                                >
                                    {lng.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </header>
    )
}
