import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Feedants – Competition Details',
  description: 'Join Feedants Classical Dance competition. Win exciting prizes, showcase your talent, and get recognized by expert judges.',
  keywords: 'dance competition, classical dance, feedants, online competition, prize pool',
  openGraph: {
    title: 'Feedants Classical Dance Competition',
    description: 'Win ₹1,500 in prize pool. Entry fee only ₹99.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-100 min-h-screen">
        <div className="max-w-md mx-auto min-h-screen bg-white shadow-xl relative flex flex-col overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}
