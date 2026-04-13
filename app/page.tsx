'use client'

import { useState, useMemo, useEffect } from 'react'
import { QrCode, Settings, AlertCircle } from 'lucide-react'
import BillCard from '@/components/BillCard'
import ParticipantManager from '@/components/ParticipantManager'
import ItemAssigner from '@/components/ItemAssigner'
import { translations, Language, TranslationType } from '@/lib/i18n'
import { Participant, BillItem } from '@/types'
import { generateFPSPayload } from './lib/fps'
import CustomHeader from './components/CustomHeader'
import SplitResult from './components/SplitResult'
import FpsInfoDialog from './components/dialog/FpsInfoDialog'
import QrCodeDialog from './components/dialog/QrCodeDialog'

export default function Home() {
    const [lang, setLang] = useState<Language>('zh-HK')
    const t: TranslationType = translations[lang]

    const [participants, setParticipants] = useState<Participant[]>([{ id: 'p1', name: 'Me' }])
    const [items, setItems] = useState<BillItem[]>([])

    const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null)
    const [isScanning, setIsScanning] = useState(false)
    const [splitMode, setSplitMode] = useState<'AA' | 'AB'>('AA')

    const [showSettings, setShowSettings] = useState(false)
    const [fpsId, setFpsId] = useState('') // user fps ID or phone number

    useEffect(() => {
        const storedFpsId = localStorage.getItem('fpsId')
        if (storedFpsId) {
            setFpsId(storedFpsId)
        }
    }, [])

    const summary = useMemo(() => {
        const total = items.reduce((sum, item) => sum + item.price, 0)
        const personBalances: Record<string, number> = {}
        const numParticipants = participants.length

        participants.forEach((p) => (personBalances[p.id] = 0))

        if (splitMode === 'AA') {
            const splitAmount = numParticipants > 0 ? total / numParticipants : 0
            participants.forEach((p) => {
                personBalances[p.id] = splitAmount
            })
        } else {
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
        }

        return { total, personBalances }
    }, [items, participants, splitMode])

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
            alert(t.errors?.ocrFailed || '識別失敗')
        } finally {
            setIsScanning(false)
        }
    }

    const currentAmount = selectedPersonId ? summary.personBalances[selectedPersonId] : 0
    const fpsPayloadString = generateFPSPayload(fpsId, currentAmount)

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            <CustomHeader lang={lang} setLang={setLang} setShowSettings={setShowSettings} t={t} />

            <div className="max-w-6xl mx-auto px-4 mt-6 pb-32 md:pb-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-7 space-y-6">
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
                        {splitMode === 'AB' && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                                <ItemAssigner
                                    items={items}
                                    setItems={setItems}
                                    participants={participants}
                                    t={t}
                                />
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-5">
                        <div className="md:sticky md:top-28 space-y-6">
                            <SplitResult
                                participants={participants}
                                summary={summary}
                                splitMode={splitMode}
                                setSplitMode={setSplitMode}
                                setSelectedPersonId={setSelectedPersonId}
                                setItems={setItems}
                                setParticipants={setParticipants}
                                t={t}
                            />

                            {!fpsId && (
                                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 text-amber-700 animate-in fade-in">
                                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-bold">{t.qr.infoMissingTitle}</p>
                                        <p className="mt-1">{t.qr.infoMissingDesc}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showSettings && (
                <FpsInfoDialog
                    t={t}
                    fpsId={fpsId}
                    setFpsId={setFpsId}
                    setShowSettings={setShowSettings}
                />
            )}

            {selectedPersonId && (
                <QrCodeDialog
                    participants={participants}
                    selectedPersonId={selectedPersonId}
                    fpsId={fpsId}
                    fpsPayloadString={fpsPayloadString}
                    currentAmount={currentAmount}
                    setSelectedPersonId={setSelectedPersonId}
                    t={t}
                />
            )}
        </main>
    )
}
