'use client'

import { TranslationType } from '@/lib/i18n'
import { BillItem } from '@/types'
import { Plus, Trash2, Camera, Check, X, Edit3, AlertCircle } from 'lucide-react'
import { useState } from 'react'

interface BillCardProps {
    items: BillItem[]
    setItems: React.Dispatch<React.SetStateAction<BillItem[]>>
    isScanning: boolean
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
    t: TranslationType
}

export default function BillCard({
    items,
    setItems,
    isScanning,
    handleFileUpload,
    t,
}: BillCardProps) {
    // edit status adn validation
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState('')
    const [editPrice, setEditPrice] = useState(0)
    const [editError, setEditError] = useState('')

    // add item status and validation
    const [isAddingItem, setIsAddingItem] = useState(false)
    const [newItemName, setNewItemName] = useState('')
    const [newItemPrice, setNewItemPrice] = useState(0)
    const [addError, setAddError] = useState('')

    // validation logic for both editing and adding
    const validate = (name: string, p: number) => {
        if (!name.trim()) return t.errors.emptyName
        if (isNaN(p) || p <= 0) return t.errors.invalidPrice
        if (p > 10000) return t.errors.tooLarge
        return ''
    }

    const startEditing = (item: BillItem) => {
        setEditingId(item.id)
        setEditName(item.name)
        setEditPrice(item.price)
        setEditError('')
    }

    const saveEdit = (id: string) => {
        const error = validate(editName, editPrice)
        if (error) {
            setEditError(error)
            return
        }
        setItems(
            items.map((item) =>
                item.id === id ? { ...item, name: editName.trim(), price: editPrice } : item,
            ),
        )
        setEditingId(null)
    }

    const handleAddItem = () => {
        const error = validate(newItemName, newItemPrice)
        if (error) {
            setAddError(error)
            return
        }
        setItems([
            ...items,
            {
                id: Date.now().toString(),
                name: newItemName.trim(),
                price: newItemPrice,
                assignedTo: [],
            },
        ])
        setNewItemName('')
        setNewItemPrice(0)
        setAddError('')
        setIsAddingItem(false)
    }

    const handleDeleteItem = (id: string) => {
        setItems(items.filter((item) => item.id !== id))
    }

    return (
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-brand">{t.bill.itemsTitle}</h2>
                <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-lg">
                    {items.length} ITEMS
                </span>
            </div>

            <div className="space-y-3 mb-6">
                {items.length === 0 && !isAddingItem && (
                    <div className="text-center py-10 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">
                        {t.bill.empty}
                    </div>
                )}

                {items.map((item) => (
                    <div key={item.id}>
                        {editingId === item.id ? (
                            <div className="space-y-2 animate-in fade-in zoom-in duration-200">
                                <div className="flex items-center gap-2 bg-brand-50/30 p-2 rounded-xl border border-brand/20">
                                    <input
                                        value={editName}
                                        onChange={(e) => {
                                            setEditName(e.target.value)
                                            setEditError('')
                                        }}
                                        className={`flex-1 p-2 bg-white border rounded-lg text-sm focus:outline-none ${editError ? 'border-red-500' : 'border-brand'}`}
                                        placeholder={t.bill.placeholderName}
                                    />
                                    <input
                                        type="number"
                                        value={isNaN(editPrice) || editPrice === 0 ? '' : editPrice}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            setEditPrice(val === '' ? 0 : parseFloat(val))
                                            setEditError('')
                                        }}
                                        className={`w-20 p-2 bg-white border rounded-lg text-sm focus:outline-none ${editError ? 'border-red-500' : 'border-brand'}`}
                                        placeholder={t.bill.placeholderPrice}
                                    />
                                    <button
                                        onClick={() => saveEdit(item.id)}
                                        className="p-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors"
                                    >
                                        <Check size={16} />
                                    </button>
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="p-2 bg-slate-200 text-slate-500 rounded-lg"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                {editError && (
                                    <p className="text-xs text-red-500 flex items-center gap-1 ml-2">
                                        <AlertCircle size={12} /> {editError}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="flex justify-between items-center p-3 bg-slate-50 hover:bg-slate-100 transition-all rounded-xl border border-transparent hover:border-brand/10 group">
                                <div
                                    className="flex-1 cursor-pointer"
                                    onClick={() => startEditing(item)}
                                >
                                    <p className="font-medium text-slate-700">{item.name}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span
                                        className="text-brand font-bold"
                                        onClick={() => startEditing(item)}
                                    >
                                        HK$ {item.price.toFixed(2)}
                                    </span>
                                    <div className="flex items-center border-l border-slate-200 ml-2 pl-2 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => startEditing(item)}
                                            className="text-slate-300 hover:text-brand p-1"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="text-slate-300 hover:text-red-500 p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {isAddingItem ? (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-in slide-in-from-top-2">
                    <div>
                        <input
                            type="text"
                            placeholder={t.bill.placeholderName}
                            value={newItemName}
                            onChange={(e) => {
                                setNewItemName(e.target.value)
                                setAddError('')
                            }}
                            className={`w-full p-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-brand/10 ${addError && !newItemName ? 'border-red-500' : 'border-slate-200 focus:border-brand'}`}
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder={t.bill.placeholderPrice}
                            value={isNaN(newItemPrice) || newItemPrice === 0 ? '' : newItemPrice}
                            onChange={(e) => {
                                const val = e.target.value
                                setNewItemPrice(val === '' ? 0 : parseFloat(val))
                                setAddError('')
                            }}
                            className={`w-full p-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-brand/10 ${addError && (isNaN(newItemPrice) || newItemPrice <= 0) ? 'border-red-500' : 'border-slate-200 focus:border-brand'}`}
                        />
                    </div>

                    {addError && (
                        <div className="flex items-center gap-1.5 text-red-500 text-xs font-medium bg-red-50 p-2 rounded-lg">
                            <AlertCircle size={14} />
                            {addError}
                        </div>
                    )}

                    <div className="flex gap-2 pt-1">
                        <button
                            onClick={handleAddItem}
                            className="flex-1 bg-brand text-white py-2.5 rounded-xl font-bold hover:bg-brand-dark transition-all active:scale-95 shadow-md shadow-brand/10"
                        >
                            {t.bill.confirmAdd}
                        </button>
                        <button
                            onClick={() => {
                                setIsAddingItem(false)
                                setAddError('')
                            }}
                            className="flex-1 bg-white text-slate-500 border border-slate-200 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all"
                        >
                            {t.bill.cancel}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-wrap gap-3">
                    <div className='w-full'>{ t.bill.OCRHint }</div>
                    <div className="relative flex-1">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={isScanning}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <button
                            className={`w-full py-3 flex items-center justify-center gap-2 rounded-xl font-bold border-2 transition-all ${isScanning ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed' : 'bg-brand-50 text-brand border-brand hover:bg-brand hover:text-white shadow-sm shadow-brand/10'}`}
                            disabled={isScanning}
                        >
                            {isScanning ? (
                                <span className="animate-pulse">{t.bill.scanning}</span>
                            ) : (
                                <>
                                    <Camera size={20} />
                                    {t.bill.scan}
                                </>
                            )}
                        </button>
                    </div>
                    <button
                        onClick={() => setIsAddingItem(true)}
                        className="flex-1 py-3 flex items-center justify-center gap-2 text-slate-500 border-2 border-slate-200 border-dashed rounded-xl font-bold hover:border-brand hover:text-brand hover:bg-brand-50/30 transition-all"
                    >
                        <Plus size={20} /> {t.bill.manual}
                    </button>
                </div>
            )}
        </section>
    )
}
