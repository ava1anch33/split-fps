'use client'

import { TranslationType } from '@/lib/i18n'
import { ChevronRight, RotateCcw, Users } from 'lucide-react'

interface SplitResultProps {
    participants: { id: string; name: string }[]
    summary: {
        total: number
        personBalances: Record<string, number>
    }
    splitMode: 'AA' | 'AB'
    setSplitMode: React.Dispatch<React.SetStateAction<'AA' | 'AB'>>
    setSelectedPersonId: React.Dispatch<React.SetStateAction<string | null>>
    setItems: React.Dispatch<React.SetStateAction<any[]>>
    setParticipants: React.Dispatch<React.SetStateAction<{ id: string; name: string }[]>>
    t: TranslationType
}

export default function SplitResult({
    participants,
    summary,
    splitMode,
    setSplitMode,
    setSelectedPersonId,
    setItems,
    setParticipants,
    t,
}: SplitResultProps) {
    const handleReset = () => {
        if (window.confirm('確定要發起新帳單嗎？這將清空所有項目和參與者。')) {
            setItems([])
            setParticipants([{ id: 'p1', name: 'Me' }])
            setSplitMode('AA')
        }
    }
    return (
        <section className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg md:text-xl font-bold text-slate-700 flex items-center gap-2">
                    <Users size={22} className="text-brand" /> {t.split.splitResultTitle}
                </h2>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setSplitMode('AA')}
                        className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${splitMode === 'AA' ? 'bg-white text-brand shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        AA
                    </button>
                    <button
                        onClick={() => setSplitMode('AB')}
                        className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${splitMode === 'AB' ? 'bg-white text-brand shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        AB
                    </button>
                </div>
            </div>

            <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
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

            <div className="mt-6 pt-4 border-t border-dashed border-slate-200 space-y-4">
                <div className="flex justify-between items-end">
                    <span className="text-slate-400 font-bold text-sm uppercase">
                        {t.common.total}
                    </span>
                    <span className="text-3xl font-black text-slate-800">
                        HK$ {summary.total.toFixed(2)}
                    </span>
                </div>
                <button
                    onClick={handleReset}
                    className="w-full py-3 flex items-center justify-center gap-2 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-xl font-bold transition-all border border-transparent hover:border-red-100 active:scale-[0.98]"
                >
                    <RotateCcw size={18} />
                    發起新帳單
                </button>
            </div>
        </section>
    )
}
