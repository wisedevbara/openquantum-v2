import type { MDXComponents } from 'mdx/types'
import ConceptModel from '@/components/three/ConceptModel'
import InteractiveQubit from '@/components/mdx/InteractiveQubit'

/**
 * MDXComponents.tsx - Custom component map for MDX content
 * 
 * Components defined here can be used inside .mdx article files.
 * This is the "allowed whitelist" for interactive/3D components that
 * article authors can embed directly in the middle of article text.
 * 
 * Example usage in an .mdx file:
 * ```mdx
 * # Judul
 * 
 * Beberapa paragraf teks...
 * 
 * <QubitDemo caption="Visualisasi qubit" />
 * 
 * Lanjutan teks setelah visualisasi 3D...
 * ```
 * 
 * QubitDemo sekarang dirender melalui ConceptModel (config-driven) —
 * memunculkan QubitSphere (primitive) saat ini, siap beralih ke GLB.
 */

// QubitDemo wraps ConceptModel (which includes Scene) with a caption.
// This is what article authors reference in MDX.
export function QubitDemo({
  id = 'qubit',
  caption = 'Visualisasi 3D',
  className = '',
}: {
  id?: string
  caption?: string
  className?: string
}) {
  return (
    <figure className="my-8">
      <div className="rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 h-72">
        <ConceptModel id={id} className={className} />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-gray-500 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// Standard MDX/HTML component overrides
export const mdxComponents: MDXComponents = {
  // Custom 3D components (ready for article embedding)
  QubitDemo,
  // Interactive educational component (simulate measurement/collapse)
  InteractiveQubit,
}