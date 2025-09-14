import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SafarGo - Covoiturage & Tourisme en Algérie',
  description: 'Partagez vos trajets et découvrez les merveilles de l\'Algérie',
  keywords: 'covoiturage, algérie, tourisme, voyage, transport',
  authors: [{ name: 'SafarGo Team' }],
  openGraph: {
    title: 'SafarGo - Covoiturage & Tourisme en Algérie',
    description: 'Partagez vos trajets et découvrez les merveilles de l\'Algérie',
    url: 'https://safargo.com',
    siteName: 'SafarGo',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SafarGo - Covoiturage & Tourisme en Algérie',
    description: 'Partagez vos trajets et découvrez les merveilles de l\'Algérie',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  themeColor: '#006233',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}