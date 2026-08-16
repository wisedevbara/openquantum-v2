'use client'

import Scene from '@/components/three/Scene'
import QubitSphere from '@/components/three/primitives/QubitSphere'
import GLBModel from '@/components/three/loaders/GLBModel'
import { conceptVisuals } from '@/config/concept-visuals'

/**
 * ConceptModel.tsx - Wrapper yang merender visualisasi 3D untuk sebuah konsep
 * 
 * Membaca config dari src/config/concept-visuals.ts untuk menentukan
 * apakah konsep dirender sebagai primitive (komponen React 3D) atau sebagai
 * model GLB. Dibungkus Scene sehingga siap pakai langsung di halaman maupun
 * di dalam MDX.
 * 
 * Saat ini hanya "qubit" (primitive). Ketika model GLB dari Sketchfab siap,
 * cukup ubah config type="glb" + path GLB — TANPA mengubah titik pemakaian.
 * 
 * Usage:
 *   <ConceptModel id="qubit" />
 */

interface ConceptModelProps {
  /** id konsep sesuai kunci di concept-visuals (mis. "qubit") */
  id: string
  /** style/pembungkus visual opsional */
  className?: string
}

// Map dari nama primitive di config → komponen React.
// Ini menjaga ConceptModel tetap config-driven (tidak hardcode).
const primitiveComponents: Record<string, React.ComponentType> = {
  QubitSphere,
}

export default function ConceptModel({ id, className = '' }: ConceptModelProps) {
  const config = conceptVisuals[id]

  // Konsep tidak dikenali → render kosong (tidak rusak halaman)
  if (!config) {
    return null
  }

  let visual: React.ReactNode = null

  if (config.type === 'glb' && config.glb?.path) {
    visual = (
      <GLBModel
        path={config.glb.path}
        scale={config.glb.scale ?? 1}
        position={config.glb.position ?? [0, 0, 0]}
      />
    )
  } else if (config.type === 'primitive' && config.primitive) {
    const Primitive = primitiveComponents[config.primitive]
    visual = Primitive ? <Primitive /> : null
  }

  return (
    <div className={className}>
      <Scene>{visual}</Scene>
    </div>
  )
}