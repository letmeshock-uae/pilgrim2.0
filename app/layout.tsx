import type { Metadata, Viewport } from 'next'
import './globals.css'

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
  themeColor: '#1c1c1e',
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
      <body className="bg-neutral-300">
        <div
          id="app-root"
          className="max-w-[480px] mx-auto min-h-[100dvh] bg-background relative shadow-[0_0_60px_rgba(0,0,0,0.15)]"
        >
          {children}
        </div>
      </body>
    </html>
  )
}
