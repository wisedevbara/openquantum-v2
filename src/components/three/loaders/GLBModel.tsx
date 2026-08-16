'use client'

import { Suspense } from 'react'
import { useGLTF } from '@react-three/drei'
import type { Object3D } from 'three'

/**
 * GLBModel.tsx - Loader untuk model GLB
 * 
 * Memuat model .glb (files dari Sketchfab di tahap upgrade) via useGLTF
 * dari @react-three/drei, dibungkus Suspense dengan fallback loading.
 * BELUM dipakai di konfigurasi manapun (belum ada file GLB), tapi siap
 * dipanggil kapan saja.
 * 
 * Usage:
 *   <GLBModel path="/models/qubit.glb" scale={1} />
 */

interface GLBModelProps {
  /** path ke file .glb (di public/models/) */
  path: string
  /** skala model — default 1 */
  scale?: number
  /** posisi model — default [0,0,0] */
  position?: [number, number, number]
}

// Muat & siapkan model GLB
function GLBContent({ path }: { path: string }) {
  const { scene } = useGLTF(path) as unknown as { scene: Object3D }
  return <primitive object={scene} />
}

export default function GLBModel({ path, scale = 1, position = [0, 0, 0] }: GLBModelProps) {
  return (
    <group position={position} scale={scale}>
      {/* Suspense menangani loading; fallback sederhana saat menunggu */}
      <Suspense fallback={<FallbackPrimitive />}>
        <GLBContent path={path} />
      </Suspense>
    </group>
  )
}

// Fallback sementara saat model GLB sedang dimuat
function FallbackPrimitive() {
  return (
    <mesh>
      {/* placeholder: bola polos kecil sebagai indikator loading */}
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="#888888" wireframe />
    </mesh>
  )
}