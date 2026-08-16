import { notFound } from 'next/navigation'
import Link from 'next/link'
import { compileMdx, getConceptBySlug, getConceptSlugs } from '@/lib/mdx'
import { mdxComponents } from '@/components/mdx/MDXComponents'
import ConceptModel from '@/components/three/ConceptModel'
import { conceptVisuals } from '@/config/concept-visuals'

/**
 * Konsep detail page
 * Displays a prominent hero 3D visualization (based on conceptId from frontmatter)
 * at the top, followed by the MDX body text.
 * Uses static generation (SSG) via generateStaticParams, same pattern as articles.
 */

interface KonsepPageProps {
  params: Promise<{ slug: string }>
}

export default async function KonsepPage({ params }: KonsepPageProps) {
  const { slug } = await params
  const concept = getConceptBySlug(slug)

  if (!concept) {
    notFound()
  }

  // Validasi conceptId ada di registry visual — jika tidak, hero tetap render teks
  const hasVisual = concept.metadata.conceptId && concept.metadata.conceptId in conceptVisuals

  // Compile body MDX ke React components (bisa embed visual tambahan di tengah teks)
  const content = await compileMdx(concept.content, mdxComponents)

  return (
    <main className="bg-gray-50 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/konsep" className="text-sm text-blue-600 hover:underline pt-8 inline-block">
          ← Kembali ke daftar konsep
        </Link>

        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mt-4">
            {concept.metadata.title}
          </h1>
          <p className="text-xl text-gray-600 mt-2">
            {concept.metadata.description}
          </p>
        </header>
      </div>

      {/* HERO: visualisasi 3D besar & menonjol, dirender berdasarkan conceptId */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 h-[420px] shadow-xl mb-12">
          {hasVisual ? (
            <ConceptModel id={concept.metadata.conceptId} />
          ) : (
            // Fallback bila conceptId tidak dikenal/salah
            <div className="flex items-center justify-center h-full text-gray-400">
              Visualisasi tidak tersedia untuk konsep ini
            </div>
          )}
        </div>
      </div>

      {/* MDX body text */}
      <article className="max-w-3xl mx-auto px-4">
        <div className="prose prose-lg max-w-none">
          {content}
        </div>
      </article>
    </main>
  )
}

/**
 * Generate static paths for all concepts at build time
 * Required for static generation in Next.js App Router
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = getConceptSlugs()
  return slugs.map((slug) => ({ slug }))
}