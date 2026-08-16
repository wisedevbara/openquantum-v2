import Link from 'next/link'

/**
 * Footer.tsx - Footer sederhana, ditampilkan di semua halaman via root layout
 */
export default function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} OpenQuantum — Belajar quantum computing lewat visual 3D
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <Link href="/konsep" className="hover:text-gray-900">Konsep</Link>
          <Link href="/artikel" className="hover:text-gray-900">Artikel</Link>
          <span className="text-gray-400">by Bara</span>
        </div>
      </div>
    </footer>
  )
}