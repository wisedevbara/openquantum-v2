import Link from 'next/link'
import { getAllArticles, formatDate } from '@/lib/mdx'

/**
 * Artikel listing page
 * Displays all articles sorted by date (newest first)
 */

export default function ArtikelPage() {
  const articles = getAllArticles()

  return (
    <main className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Artikel Quantum Computing
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Koleksi artikel edukasi quantum computing untuk pemula
        </p>
        
        <div className="space-y-6">
          {articles.map((article) => (
            <Link 
              key={article.slug} 
              href={`/artikel/${article.slug}`}
              className="block group"
            >
              <article className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {article.metadata.title}
                </h2>
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {article.metadata.description}
                </p>
                <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                  <span>{formatDate(article.metadata.date)}</span>
                  {article.metadata.author && (
                    <>
                      <span>•</span>
                      <span>{article.metadata.author}</span>
                    </>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
        
        {articles.length === 0 && (
          <p className="text-center text-gray-500">
            Belum ada artikel tersedia.
          </p>
        )}
      </div>
    </main>
  )
}