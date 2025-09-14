import type { Metadata } from 'next'
import { Inter, Cairo } from 'next/font/google'
import { Providers } from './providers'
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
  description: 'Découvrez l\'Algérie en covoiturage. Trouvez des trajets vers les plus beaux sites touristiques du pays.',
  keywords: 'covoiturage, algérie, tourisme, trajets, blablacar, safar',
  authors: [{ name: 'SafarGo Team' }],
  creator: 'SafarGo',
  publisher: 'SafarGo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'SafarGo - Covoiturage & Tourisme Algérie',
    description: 'Découvrez l\'Algérie en covoiturage. Trouvez des trajets vers les plus beaux sites touristiques du pays.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'SafarGo',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SafarGo - Covoiturage & Tourisme Algérie',
      },
    ],
    locale: 'fr_DZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SafarGo - Covoiturage & Tourisme Algérie',
    description: 'Découvrez l\'Algérie en covoiturage. Trouvez des trajets vers les plus beaux sites touristiques du pays.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" dir="ltr" className={`${inter.variable} ${cairo.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#006233" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}