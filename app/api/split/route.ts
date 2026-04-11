import { BillItem, Participant } from '@/types'
import { NextResponse } from 'next/server'

type SplitMode = 'EQUAL' | 'EXACT'

interface SplitRequest {
    items: BillItem[]
    serviceChargeRate: number
    splitMode: SplitMode
    allUsers: Participant[]
}

export async function POST(request: Request) {
    try {
        const data: SplitRequest = await request.json()
        const { items, serviceChargeRate, splitMode, allUsers } = data

        let totalServiceCharge = 0
        const totalSubtotal = items.reduce((sum, item) => sum + item.price, 0)
        if (serviceChargeRate > 1) {
            totalServiceCharge = serviceChargeRate
        } else {
            totalServiceCharge = totalSubtotal * serviceChargeRate
        }
        const grandTotal = totalSubtotal + totalServiceCharge

        const userBills: Record<
            string,
            { subtotal: number; serviceCharge: number; total: number; items: string[] }
        > = {}

        allUsers.forEach((user) => {
            userBills[user.id] = { subtotal: 0, serviceCharge: 0, total: 0, items: [] }
        })

        if (splitMode === 'EQUAL') {
            const length = allUsers.length
            const splitAmount = grandTotal / length
            const splitSubtotal = totalSubtotal / length
            const splitServiceCharge = totalServiceCharge / length

            allUsers.forEach((user) => {
                userBills[user.id] = {
                    ...userBills[user.id],
                    subtotal: Number(splitSubtotal.toFixed(2)),
                    serviceCharge: Number(splitServiceCharge.toFixed(2)),
                    total: Number(splitAmount.toFixed(2)),
                }
            })
        } else if (splitMode === 'EXACT') {
            items.forEach((item) => {
                item.assignedTo.forEach((userId) => {
                    if (userBills[userId]) {
                        userBills[userId].subtotal += item.price / item.assignedTo.length
                        userBills[userId].items.push(item.name)
                    }
                })
            })

            allUsers.forEach((user) => {
                const currentUser = userBills[user.id]
                const userShareRatio = totalSubtotal > 0 ? currentUser.subtotal / totalSubtotal : 0
                currentUser.serviceCharge = Number((totalServiceCharge * userShareRatio).toFixed(2))
                currentUser.total = Number(
                    (currentUser.subtotal + currentUser.serviceCharge).toFixed(2),
                )
            })
        }

        return NextResponse.json({
            success: true,
            data: {
                summary: {
                    subtotal: Number(totalSubtotal.toFixed(2)),
                    serviceCharge: Number(totalServiceCharge.toFixed(2)),
                    total: Number(grandTotal.toFixed(2)),
                },
                userBills,
            },
        })
    } catch {
        return NextResponse.json(
            { success: false, error: 'Invalid request format' },
            { status: 400 },
        )
    }
}
