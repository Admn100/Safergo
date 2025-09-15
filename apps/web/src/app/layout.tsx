import type { Metadata } from 'next'
import { Inter, Cairo } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const cairo = Cairo({ 
  subsets: ['arabic'],
  variable: '--font-cairo',
})

export const metadata: Metadata = {
  title: 'SafarGo - Covoiturage & Tourisme Algérie',
  description: 'Application de covoiturage avec module tourisme algérien',
  keywords: ['covoiturage', 'tourisme', 'algérie', 'transport', 'voyage'],
  authors: [{ name: 'SafarGo Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#006233',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" dir="ltr">
      <body className={`${inter.variable} ${cairo.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}