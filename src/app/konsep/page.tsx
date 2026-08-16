import Link from 'next/link'
import { getAllConcepts } from '@/lib/mdx'
import { conceptVisuals } from '@/config/concept-visuals'

/**
 * Konsep listing page
 * Displays all quantum concepts sorted alphabetically by title.
 * Each card links to /konsep/[slug].
 */

// Label singkat untuk conceptId (untuk badge visual)
const conceptLabels: Record<string, string> = {
  qubit: 'Qubit',
  blochSphere: 'Bloch Sphere',
  entanglementPair: 'Entanglement',
}

export default function KonsepPage() {
  const concepts = getAllConcepts()

  return (
    <main className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Konsep Quantum
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Eksplorasi konsep quantum computing lewat visualisasi 3D interaktif
        </p>
        
        <div className="space-y-6">
          {concepts.map((concept) => {
            // Validasi conceptId ada di registry visual (jika tidak, tag "tanpa visual")
            const hasVisual = concept.metadata.conceptId in conceptVisuals
            return (
              <Link
                key={concept.slug}
                href={`/konsep/${concept.slug}`}
                className="block group"
              >
                <article className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {concept.metadata.title}
                    </h2>
                    {hasVisual && (
                      <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        3D {conceptLabels[concept.metadata.conceptId] || concept.metadata.conceptId}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-2">
                    {concept.metadata.description}
                  </p>
                </article>
              </Link>
            )
          })}
        </div>
        
        {concepts.length === 0 && (
          <p className="text-center text-gray-500">
            Belum ada konsep tersedia.
          </p>
        )}
      </div>
    </main>
  )
}