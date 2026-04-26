import type { Metadata } from 'next'
import { Familjen_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const familjenGrotesk = Familjen_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-familjen',
})

export const metadata: Metadata = {
  title: 'Opal Ambassador OS',
  description: 'Student ambassador pipeline management for Opal',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${familjenGrotesk.variable} bg-[#0A0A0A]`}>
      <body className="font-sans antialiased bg-[#0A0A0A]">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
