'use client'

import { useState, useMemo, useEffect } from 'react'
import { Receipt, QrCode, Users, CheckCircle2, ChevronRight } from 'lucide-react'
import BillCard from '@/components/BillCard'
import ParticipantManager from '@/components/ParticipantManager'
import ItemAssigner from '@/components/ItemAssigner'
import { translations, Language, TranslationType } from '@/lib/i18n'
import { Participant, BillItem } from '@/types'

export default function Home() {
    const [lang, setLang] = useState<Language>('zh-HK')
    const t: TranslationType = translations[lang]

    const [participants, setParticipants] = useState<Participant[]>([{ id: 'p1', name: 'Me' }])

    const [items, setItems] = useState<BillItem[]>([])

    const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null)
    const [isScanning, setIsScanning] = useState(false)

    const summary = useMemo(() => {
        const total = items.reduce((sum, item) => sum + item.price, 0)
        const personBalances: Record<string, number> = {}
        participants.forEach((p) => (personBalances[p.id] = 0))

        items.forEach((item) => {
            if (item.assignedTo.length > 0) {
                const sharePrice = item.price / item.assignedTo.length
                item.assignedTo.forEach((pid) => {
                    if (personBalances[pid] !== undefined) {
                        personBalances[pid] += sharePrice
                    }
                })
            }
        })

        return { total, personBalances }
    }, [items, participants])

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setIsScanning(true)
        const formData = new FormData()
        formData.append('file', file)
        try {
            const res = await fetch('/api/ocr', { method: 'POST', body: formData })
            const data = await res.json()
            if (data.success) {
                const newItems = data.items.map((item: any) => ({
                    ...item,
                    assignedTo: participants.map((p) => p.id),
                }))
                setItems((prev) => [...prev, ...newItems])
            }
        } catch (err) {
            alert(t.errors.ocrFailed)
        } finally {
            setIsScanning(false)
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800 pb-32 font-sans">
            {/* Header */}
            <header className="bg-brand text-white p-6 rounded-b-3xl shadow-lg shadow-brand/20 sticky top-0 z-30">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                            <Receipt size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold leading-tight">{t.common.title}</h1>
                            <p className="text-[10px] text-brand-50 opacity-80 uppercase tracking-widest">
                                {t.common.subtitle}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-1 bg-black/10 p-1 rounded-lg">
                        <button
                            onClick={() => setLang('zh-HK')}
                            className={`px-2 py-1 text-xs rounded-md transition-all ${lang === 'zh-HK' ? 'bg-white text-brand font-bold shadow-sm' : 'text-white/70'}`}
                        >
                            繁
                        </button>
                        <button
                            onClick={() => setLang('en-US')}
                            className={`px-2 py-1 text-xs rounded-md transition-all ${lang === 'en-US' ? 'bg-white text-brand font-bold shadow-sm' : 'text-white/70'}`}
                        >
                            EN
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-md mx-auto px-4 mt-6 space-y-6">
                <ParticipantManager
                    participants={participants}
                    setParticipants={setParticipants}
                    t={t}
                />

                <BillCard
                    items={items}
                    setItems={setItems}
                    isScanning={isScanning}
                    handleFileUpload={handleFileUpload}
                    t={t}
                />

                <ItemAssigner items={items} setItems={setItems} participants={participants} t={t} />

                <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-4">
                    <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <Users size={20} className="text-brand" /> 分帳結果
                    </h2>

                    <div className="space-y-3">
                        {participants.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => setSelectedPersonId(p.id)}
                                className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-brand/30 hover:bg-brand-50/20 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-100 font-bold text-brand shadow-sm">
                                        {p.name[0]}
                                    </div>
                                    <span className="font-bold text-slate-600">{p.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-brand font-black text-lg">
                                        ${summary.personBalances[p.id]?.toFixed(1)}
                                    </span>
                                    <ChevronRight
                                        size={16}
                                        className="text-slate-300 group-hover:text-brand"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-dashed border-slate-200">
                        <div className="flex justify-between items-end">
                            <span className="text-slate-400 font-bold text-sm uppercase">
                                {t.common.total}
                            </span>
                            <span className="text-2xl font-black text-slate-800">
                                HK$ {summary.total.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </section>
            </div>

            {/* 收款碼彈窗 (FPS Modal) */}
            {selectedPersonId && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50 animate-in fade-in">
                    <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 flex flex-col items-center animate-in slide-in-from-bottom-10 duration-300">
                        <div className="w-12 h-1 bg-slate-200 rounded-full mb-6 sm:hidden" />

                        <div className="w-16 h-16 bg-brand-50 text-brand rounded-full flex items-center justify-center mb-4">
                            <QrCode size={32} />
                        </div>

                        <h3 className="text-xl font-bold text-slate-800">
                            {participants.find((p) => p.id === selectedPersonId)?.name} 的收款碼
                        </h3>
                        <p className="text-slate-400 text-xs mt-1 mb-8">
                            請使用支持 FPS 的銀行 App 掃描
                        </p>

                        <div className="w-56 h-56 bg-white rounded-3xl flex items-center justify-center border-4 border-brand/5 p-4 mb-6 shadow-xl relative">
                            <QrCode size={160} className="text-slate-800" />
                            <div className="absolute top-0 right-0 -mr-2 -mt-2 bg-brand text-white px-3 py-1 rounded-full text-[10px] font-black">
                                FPS
                            </div>
                        </div>

                        <div className="w-full bg-slate-50 p-4 rounded-2xl mb-8 border border-slate-100 text-center">
                            <span className="text-brand font-black text-3xl">
                                HK$ {summary.personBalances[selectedPersonId]?.toFixed(2)}
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
            )}
        </main>
    )
}
