'use client'
import { useState } from 'react'
import { Plus, User, X } from 'lucide-react'
import { TranslationType } from '@/lib/i18n'

interface Participant {
    id: string
    name: string
}

interface Props {
    participants: Participant[]
    setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>
    t: TranslationType
}

export default function ParticipantManager({ participants, setParticipants, t }: Props) {
    const [name, setName] = useState('')

    const addPerson = () => {
        if (!name.trim()) return
        setParticipants([...participants, { id: Date.now().toString(), name: name.trim() }])
        setName('')
    }

    const removePerson = (id: string) => {
        setParticipants(participants.filter((p) => p.id !== id))
    }

    return (
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-700 mb-4">
                {t.split.participantTitle}
            </h2>

            <div className="flex flex-wrap gap-2 mb-4">
                {participants.map((p) => (
                    <span
                        key={p.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-50 text-brand rounded-full text-sm font-bold animate-in zoom-in"
                    >
                        <User size={14} /> {p.name}
                        <button onClick={() => removePerson(p.id)} className="hover:text-red-500">
                            <X size={14} />
                        </button>
                    </span>
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addPerson()}
                    placeholder={t.split.placeholderName}
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand"
                />
                <button
                    onClick={addPerson}
                    className="p-2.5 bg-brand text-white rounded-xl hover:bg-brand-dark"
                >
                    <Plus size={24} />
                </button>
            </div>
        </section>
    )
}
