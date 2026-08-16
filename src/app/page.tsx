import Link from 'next/link'
import ConceptModel from '@/components/three/ConceptModel'
import { getAllArticles } from '@/lib/mdx'
import { getAllConcepts } from '@/lib/mdx'

/**
 * Homepage — hero dengan visualisasi 3D + pintu masuk ke Konsep & Artikel
 */
export default function Home() {
  const articles = getAllArticles()
  const concepts = getAllConcepts()

  return (
    <main>
      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block text-xs font-medium bg-white/10 border border-white/20 px-3 py-1 rounded-full mb-6">
              ⚛️ Quantum Computing, dibuat visual
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Pelajari Kuantum Lewat
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> Visual 3D Interaktif</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Jelajahi konsep quantum computing — qubit, superposisi, dan entanglement —
              dengan ilustrasi 3D yang bisa diputar, dibuat untuk pemula.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/konsep"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 font-semibold transition-opacity"
              >
                Mulai dari Konsep →
              </Link>
              <Link
                href="/artikel"
                className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 font-semibold transition-colors"
              >
                Baca Artikel
              </Link>
            </div>
          </div>

          {/* Hero 3D — qubit sebagai representasi visual utama */}
          <div className="h-72 md:h-80 rounded-2xl overflow-hidden">
            <ConceptModel id="qubit" />
          </div>
        </div>
      </section>

      {/* KONSEP PREVIEW */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Konsep Utama</h2>
          <Link href="/konsep" className="text-blue-600 hover:underline text-sm">
            Lihat semua →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {concepts.slice(0, 3).map((concept) => (
            <Link key={concept.slug} href={`/konsep/${concept.slug}`} className="group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 h-full">
                <div className="h-40 rounded-lg overflow-hidden mb-4 bg-slate-900">
                  <ConceptModel id={concept.metadata.conceptId} className="h-full" />
                </div>
                <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                  {concept.metadata.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {concept.metadata.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ARTIKEL PREVIEW */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Artikel Terbaru</h2>
          <Link href="/artikel" className="text-blue-600 hover:underline text-sm">
            Lihat semua →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((article) => (
            <Link key={article.slug} href={`/artikel/${article.slug}`} className="group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 h-full">
                <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                  {article.metadata.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                  {article.metadata.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}