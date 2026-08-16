import Link from 'next/link'

/**
 * Nav.tsx - Navigation bar, ditampilkan di semua halaman (via root layout)
 */
export default function Nav() {
  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
            Ψ
          </span>
          <span>OpenQuantum</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            Beranda
          </Link>
          <Link
            href="/konsep"
            className="px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            Konsep
          </Link>
          <Link
            href="/artikel"
            className="px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            Artikel
          </Link>
        </div>
      </div>
    </nav>
  )
}