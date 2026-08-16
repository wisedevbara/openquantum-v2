import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDate, getArticleBySlug, getArticleSlugs, compileMdx } from '@/lib/mdx'
import { mdxComponents } from '@/components/mdx/MDXComponents'

/**
 * Individual article page
 * Uses static generation (SSG) via generateStaticParams.
 * MDX is compiled to real React components (not HTML string), so
 * interactive 3D components can be embedded directly in article body.
 */

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  
  if (!article) {
    notFound()
  }

  // Compile MDX source to React components, whitelisting mdxComponents
  const content = await compileMdx(article.content, mdxComponents)

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <article className="max-w-3xl mx-auto px-4">
        <Link href="/artikel" className="text-sm text-blue-600 hover:underline mb-8 inline-block">
          ← Kembali ke daftar artikel
        </Link>
        
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {article.metadata.title}
          </h1>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <span>{formatDate(article.metadata.date)}</span>
            {article.metadata.author && (
              <>
                <span>•</span>
                <span>{article.metadata.author}</span>
              </>
            )}
          </div>
          
          <p className="text-xl text-gray-600">
            {article.metadata.description}
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          {content}
        </div>
      </article>
    </main>
  )
}

/**
 * Generate static paths for all articles at build time
 * Required for static generation in Next.js App Router
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = getArticleSlugs()
  return slugs.map((slug) => ({ slug }))
}