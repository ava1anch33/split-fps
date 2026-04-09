'use client'

import { useState } from 'react'
import { Receipt, QrCode, Plus, Users, CheckCircle2 } from 'lucide-react'

interface BillItem {
    id: string
    name: string
    price: number
}

export default function Home() {
    const [items, setItems] = useState<BillItem[]>([
        { id: '1', name: '招牌干炒牛河', price: 88 },
        { id: '2', name: '冻柠茶', price: 22 },
    ])
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
            const res = await fetch('/api/ocr', {
                method: 'POST',
                body: formData,
            })
            const data = await res.json()
            if (data.success) {
                setItems(data.items)
            }
        } catch (err) {
            // @TODO
            console.log(err);
            
        } finally {
            setIsScanning(false)
        }
    }

    const subtotal = items.reduce((sum, item) => sum + item.price, 0)
    const serviceCharge = includeServiceCharge ? subtotal * 0.1 : 0
    const total = subtotal + serviceCharge

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800 pb-20">
            {/* 顶部导航栏 - 使用品牌色 */}
            <header className="bg-brand text-white p-6 rounded-b-3xl shadow-lg shadow-brand/20">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Receipt size={28} />
                            夹钱易 SplitFPS
                        </h1>
                        <p className="text-brand-50 text-sm mt-1 opacity-90">
                            智能分账与转数快收款
                        </p>
                    </div>
                    <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                        <Users size={24} />
                    </div>
                </div>
            </header>

            <div className="relative">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <button className="w-full bg-brand-50 text-brand border-2 border-brand py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                    {isScanning ? '正在智能識別帳單...' : '📷 拍攝/上傳收據'}
                </button>
            </div>

            <div className="max-w-md mx-auto px-4 mt-6 space-y-6">
                {/* 账单明细卡片 */}
                <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-semibold mb-4 text-slate-700">识别到的账单</h2>

                    <div className="space-y-3">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center p-3 bg-slate-50 rounded-xl"
                            >
                                <span className="font-medium">{item.name}</span>
                                <span className="text-brand font-semibold">
                                    HK$ {item.price.toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <button className="mt-4 w-full py-3 flex items-center justify-center gap-2 text-brand border-2 border-brand/20 border-dashed rounded-xl hover:bg-brand-50 transition-colors">
                        <Plus size={20} />
                        <span>手动添加菜品</span>
                    </button>
                </section>

                {/* 结算卡片 */}
                <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-600">包含 10% 服务费</span>
                        <button
                            onClick={() => setIncludeServiceCharge(!includeServiceCharge)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${includeServiceCharge ? 'bg-brand' : 'bg-slate-300'}`}
                        >
                            <div
                                className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${includeServiceCharge ? 'left-7' : 'left-1'}`}
                            />
                        </button>
                    </div>

                    <div className="border-t border-slate-100 pt-4 flex justify-between items-end">
                        <span className="text-slate-500 font-medium">总需收款</span>
                        <span className="text-3xl font-bold text-slate-800">
                            HK$ {total.toFixed(2)}
                        </span>
                    </div>
                </section>

                {/* 行动按钮区 */}
                <button
                    onClick={() => setShowQR(true)}
                    className="w-full bg-brand hover:bg-brand-dark text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand/30 transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                    <QrCode size={24} />
                    生成 FPS 收款码
                </button>

                {/* 模拟二维码弹窗 */}
                {showQR && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white w-full max-w-sm rounded-3xl p-8 flex flex-col items-center animate-in fade-in zoom-in duration-200">
                            <div className="w-16 h-16 bg-brand-50 text-brand rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">收款码已生成</h3>
                            <p className="text-slate-500 text-sm mb-6 text-center">
                                让朋友使用任何支持转数快的银行 App 扫描下方二维码付款
                            </p>

                            {/* 这里在实际项目中可以替换为真正的 QRCode 生成组件 */}
                            <div className="w-48 h-48 bg-slate-100 rounded-xl flex items-center justify-center border-4 border-brand p-2 mb-6">
                                <QrCode size={120} className="text-slate-800" />
                            </div>

                            <div className="text-center w-full bg-brand-50 py-3 rounded-lg text-brand font-bold mb-6">
                                应收: HK$ {total.toFixed(2)}
                            </div>

                            <button
                                onClick={() => setShowQR(false)}
                                className="w-full text-slate-500 font-medium py-2 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                关闭
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
