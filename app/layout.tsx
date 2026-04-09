import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: '夾錢易 - Split the Bill, Simplify the Fun',
    description:
        "A simple and efficient bill-splitting app designed to make group payments hassle-free. Whether you're dining out with friends, sharing expenses on a trip, or managing household bills, our app helps you split costs fairly and easily. With features like itemized splitting, service charge calculation, and multiple split modes, we ensure everyone pays their fair share without the stress. Say goodbye to awkward money conversations and hello to seamless bill splitting with our user-friendly app.",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    )
}
