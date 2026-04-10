'use client'

import { useEffect, useState } from 'react'
import { Receipt, QrCode, CheckCircle2 } from 'lucide-react'
import BillCard from '@/components/BillCard'
import { Language, translations, LANG_KEYS } from '@/lib/i18n'
import { BillItem } from './types'

export default function Home() {
    const [lang, setLang] = useState<Language>('zh-HK')
    const t = translations[lang]

    useEffect(() => {
        const browserLang = navigator.language;
        if (browserLang.includes('en')) setLang('en-US');
        else if (browserLang.includes('CN')) setLang('zh-CN');
        else setLang('zh-HK');
    }, []);

    const [items, setItems] = useState<BillItem[]>([])
    const [includeServiceCharge, setIncludeServiceCharge] = useState(true)
    const [showQR, setShowQR] = useState(false)
    const [isScanning, setIsScanning] = useState(false)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setIsScanning(true)
        const formData = new FormData()
        formData.append('file', file)
        try {
            const res = await fetch('/api/ocr', { method: 'POST', body: formData })
            const data = await res.json()
            if (data.success) setItems((prev) => [...prev, ...data.items])
        } catch (err) { alert("識別失敗") } finally { setIsScanning(false) }
    }

    const subtotal = items.reduce((sum, item) => sum + item.price, 0)
    const total = subtotal * (includeServiceCharge ? 1.1 : 1)

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans">
            <header className="bg-brand text-white p-6 rounded-b-3xl shadow-lg shadow-brand/20">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <Receipt size={28} />
                            <h1 className="text-2xl font-bold">{ t.common.title }</h1>
                        </div>
                        <p className="text-brand-50 text-xs mt-1 opacity-90">{ t.common.subtitle }</p>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-white/10 p-1 rounded-lg border border-white/20">
                        { 
                            LANG_KEYS.map(langItem => {
                                const key = langItem.key as Language
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setLang(key)}
                                        className={`px-2 py-1 text-xs rounded ${lang === key ? 'bg-white text-brand font-bold' : 'text-white'}`}
                                    >
                                        { langItem.label }
                                    </button>
                                )
                            })
                        }
                    </div>
                </div>
            </header>

            <div className="max-w-md mx-auto px-4 mt-6 space-y-6">
                <BillCard 
                    items={items} 
                    setItems={setItems} 
                    isScanning={isScanning} 
                    handleFileUpload={handleFileUpload} 
                    t={t}
                />

                <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-4 text-slate-600 font-medium">
                        <span>包含 10% 服務費 (加一)</span>
                        <button onClick={() => setIncludeServiceCharge(!includeServiceCharge)}
                            className={`w-12 h-6 rounded-full transition-all relative ${includeServiceCharge ? 'bg-brand' : 'bg-slate-300'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${includeServiceCharge ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                    <div className="border-t border-slate-100 pt-4 flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="text-slate-400 text-xs font-bold">Total Amount</span>
                            <span className="text-slate-500 text-sm">小計: HK$ {subtotal.toFixed(2)}</span>
                        </div>
                        <span className="text-3xl font-black text-slate-800">HK$ {total.toFixed(2)}</span>
                    </div>
                </section>

                <button onClick={() => setShowQR(true)} disabled={items.length === 0}
                    className="w-full bg-brand hover:bg-brand-dark disabled:bg-slate-300 text-white py-4 rounded-2xl font-bold text-xl shadow-xl shadow-brand/30 transition-all flex items-center justify-center gap-3">
                    <QrCode size={24} /> 生成 FPS 收款碼
                </button>

                {showQR && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
                        <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 flex flex-col items-center animate-in zoom-in">
                            <div className="w-16 h-16 bg-brand-50 text-brand rounded-full flex items-center justify-center mb-4"><CheckCircle2 size={32} /></div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">收款碼已就緒</h3>
                            <div className="w-52 h-52 bg-white rounded-2xl flex items-center justify-center border-2 border-brand/10 p-4 mb-6 shadow-inner"><QrCode size={140} className="text-slate-800" /></div>
                            <div className="text-center w-full bg-slate-50 py-4 rounded-2xl mb-8 border border-slate-100">
                                <span className="text-slate-400 text-xs block mb-1 font-bold">應收款項</span>
                                <span className="text-2xl font-black text-brand">HK$ {total.toFixed(2)}</span>
                            </div>
                            <button onClick={() => setShowQR(false)} className="w-full text-slate-400 font-bold py-2">關閉窗口</button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}