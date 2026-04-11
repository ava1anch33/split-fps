'use client'
import { TranslationType } from '@/lib/i18n'
import { BillItem, Participant } from '@/types'
import { User, Check } from 'lucide-react'

interface Props {
    items: BillItem[]
    setItems: React.Dispatch<React.SetStateAction<BillItem[]>>
    participants: Participant[]
    t: TranslationType
}

export default function ItemAssigner({ items, setItems, participants, t }: Props) {
    const toggleAssign = (itemId: string, personId: string) => {
        setItems((prev) =>
            prev.map((item) => {
                if (item.id !== itemId) return item
                const isAssigned = item.assignedTo.includes(personId)
                return {
                    ...item,
                    assignedTo: isAssigned
                        ? item.assignedTo.filter((id) => id !== personId)
                        : [...item.assignedTo, personId],
                }
            }),
        )
    }

    return (
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-700 mb-4">{t.split.assignTitle}</h2>

            <div className="space-y-4">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50"
                    >
                        <div className="flex justify-between mb-3">
                            <span className="font-bold text-slate-700">{item.name}</span>
                            <span className="text-brand font-black">HK$ {item.price}</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {participants.map((p) => {
                                const active = item.assignedTo.includes(p.id)
                                return (
                                    <button
                                        key={p.id}
                                        onClick={() => toggleAssign(item.id, p.id)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                            active
                                                ? 'bg-brand text-white shadow-md shadow-brand/20 scale-105'
                                                : 'bg-white text-slate-400 border border-slate-200'
                                        }`}
                                    >
                                        {active ? <Check size={12} /> : <User size={12} />}
                                        {p.name}
                                        {active && (
                                            <span className="ml-1 opacity-80 text-[10px]">
                                                (HK$
                                                {(item.price / item.assignedTo.length).toFixed(1)})
                                            </span>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
