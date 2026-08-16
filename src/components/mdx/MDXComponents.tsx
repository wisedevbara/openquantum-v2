import type { MDXComponents } from 'mdx/types'
import Scene from '@/components/three/Scene'
import QubitSphere from '@/components/three/primitives/QubitSphere'

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
 */

// QubitDemo is a reusable wrapper embedding QubitSphere inside a Scene,
// with a caption. This is what article authors reference in MDX.
export function QubitDemo({ caption = 'Visualisasi 3D qubit' }: { caption?: string }) {
  return (
    <figure className="my-8">
      <div className="rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 h-72">
        <Scene>
          <QubitSphere />
        </Scene>
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
}