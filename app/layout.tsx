import type { Metadata, Viewport } from 'next'
import './globals.css'
import { BottomNav } from '@/components/layout/bottom-nav'

export const metadata: Metadata = {
  title: 'Pilgrim — Hajj & Umrah Guide',
  description:
    'Your digital companion for Hajj and Umrah. Explore sacred locations, learn rituals, and receive spiritual guidance.',
  keywords: ['Hajj', 'Umrah', 'Mecca', 'Islamic guide', 'pilgrimage', 'Kaaba'],
  authors: [{ name: 'Pilgrim' }],
  openGraph: {
    title: 'Pilgrim — Hajj & Umrah Guide',
    description: 'Your digital companion for Hajj and Umrah',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-50 min-h-screen">
        <div className="page-container shadow-[0_0_40px_rgba(0,0,0,0.08)]">
          <main className="content-with-nav">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  )
}
