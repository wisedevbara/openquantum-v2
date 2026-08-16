import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/ui/nav'
import Footer from '@/components/ui/footer'

export const metadata: Metadata = {
  title: 'OpenQuantum V2',
  description: 'Quantum Computing Learning Platform with Interactive 3D Visualizations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="flex flex-col min-h-screen bg-gray-50">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}