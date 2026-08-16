'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * QubitSphere.tsx - Primitive placeholder representing a qubit as a 3D object
 *
 * Visual Design:
 * - Gradient sphere transitioning from blue (top, |0⟩) to purple (bottom, |1⟩)
 * - Gentle rotation representing quantum superposition (uncertainty/oscillation)
 * - Subtle scale pulsing suggesting quantum fluctuation
 * - Semi-transparent surface + wireframe overlay for clarity
 *
 * FIX BUG (vertex color):
 * Sebelumnya material set `vertexColors={true}` tetapi geometry TIDAK punya
 * attribute 'color' — sehingga gradient biru→ungu TIDAK PERNAH render (bug).
 * Pendekatan yang dipilih: PILIHAN B — buat geometry SphereGeometry di useMemo
 * dan assign BufferAttribute 'color' SECARA MANUAL ke tiap vertex, diinterpolasi
 * berdasar posisi Y. Ini benar-benar berfungsi & mudah diverifikasi; tidak
 * menyentuh logic animasi, hanya memperbaiki material gradient.
 *
 * Alasan memilih B (bukan A/shader onBeforeCompile):
 * - Gradient relevan berisi vertex color yang valid; assign attribute warna real
 *   lebih deterministik & kompatibel dengan lighting (standard material).
 * - Pendekatan shader onBeforeCompile lebih rapuh & menyentuh pipeline dalam.
 */

// Warna dasar gradient: atas = biru (|0⟩), bawah = ungu (|1⟩)
const COLOR_TOP = new THREE.Color('#4A90E2') // biru
const COLOR_BOTTOM = new THREE.Color('#9B51E0') // ungu

export default function QubitSphere() {
  const meshRef = useRef<THREE.Mesh>(null!)

  // Buat geometry sekali dengan warna per-vertex (gradient Y)
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.8, 64, 32)

    // Validasi & siapkan attribute 'color'
    const count = geo.attributes.position.count
    const colors = new Float32Array(count * 3)
    const pos = geo.attributes.position

    const c = new THREE.Color()
    for (let i = 0; i < count; i++) {
      // Normalisasi Y (-0.8..0.8) -> t (1..0): atas biru, bawah ungu
      const y = pos.getY(i)
      const t = (y + 0.8) / 1.6 // ≥0..1, 1=atas(biru), 0=bawah(ungu)
      c.copy(COLOR_TOP).lerp(COLOR_BOTTOM, 1 - t)
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [])

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Slow rotation to represent superposition (unchanged — proper animation)
      meshRef.current.rotation.y += 0.2 * delta
      meshRef.current.rotation.x += 0.1 * delta
      // Subtle pulsing scale
      const pulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.02 + 1
      meshRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group>
      {/* Main sphere with real per-vertex color gradient */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          vertexColors={true} // now backed by a real 'color' attribute
          transparent
          opacity={0.85}
          roughness={0.3}
          metalness={0.7}
          // Emission keeps it alive (glow-handled by Bloom in Scene)
          emissive="#9B51E0"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Wireframe overlay showing internal structure */}
      <lineSegments>
        <sphereGeometry args={[0.81, 64, 32]} />
        <wireframeGeometry args={[new THREE.SphereGeometry(0.8, 64, 32)]} />
        <lineBasicMaterial color="#FFFFFF" opacity={0.3} transparent depthWrite={false} />
      </lineSegments>
    </group>
  )
}