/**
 * concept-visuals.ts - Mapping konsep quantum ke visualisasi 3D
 * 
 * Setiap konsep didefinisikan dengan tipe visual:
 * - "primitive": render komponen React 3D bawaan (Three.js primitives)
 * - "glb": render model GLB dari file (nanti di-upgrade dari Sketchfab)
 * 
 * Struktur fleksibel — cukup tambah field baru (mis. fallback, path GLB,
 * camera settings) tanpa restrukturisasi. Ini adalah "single source of truth"
 * untuk menentukan visualisasi konsep.
 */

export interface ConceptVisualGLB {
  /** path relatif ke file .glb di public/models */
  path: string
  /** skala model GLB relatif (opsional) */
  scale?: number
  /** posisi model (opsional) — default [0,0,0] */
  position?: [number, number, number]
  /** fallback tipe primitive jika GLB gagal load (opsional, future) */
  fallbackPrimitive?: 'QubitSphere' | 'BlochSphere' | 'EntanglementPair'
}

export interface ConceptVisualConfig {
  /** tipe visualisasi: primitive (React komponen) atau glb (model file) */
  type: 'primitive' | 'glb'
  /** nama komponen primitive yang dirender saat type="primitive" */
  primitive?: 'QubitSphere' | 'BlochSphere' | 'EntanglementPair'
  /** konfigurasi GLB saat type="glb" */
  glb?: ConceptVisualGLB
  /** ensure extensibility — tambah field lain bebas di sini */
  [key: string]: unknown
}

/**
 * Registry konsep → visual. Saat ini hanya konsep "qubit" sebagai
 * primitive placeholder. Konsep lain (bloch-sphere, entanglement) menyusul.
 */
export const conceptVisuals: Record<string, ConceptVisualConfig> = {
  qubit: {
    type: 'primitive',
    primitive: 'QubitSphere',
  },
}