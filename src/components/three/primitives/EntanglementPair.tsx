'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * EntanglementPair.tsx - Primitive placeholder representing two entangled qubits
 * 
 * Entanglement (keterikatan kuantum): mengukur satu qubit langsung menentukan
 * state qubit pasangannya, apa pun jaraknya. Elemen visual paling penting adalah
 * korelasi — kedua qubit harus berdenyut & berubah warna SECARA SINKRON.
 * 
 * Visual Design:
 * - Dua sphere kecil terpisah (gaya & warna senada QubitSphere)
 * - Partikel mengalir di antara keduanya = keterikatan/transfer korelasi
 * - Berdenyut & berubah warna secara sinkron (bersamaan) = korelasi kuantum
 * 
 * Design Rationale (konsisten gaya QubitSphere):
 * - Skema biru-ungu: kedua sphere mengalir bersama dari biru (|0⟩) ke ungu (|1⟩)
 *   dan kembali — menggambarkan kedua qubit selalu berada di state yang sama
 * - Denyut sinkron (bukan independen): menekankan bahwa keduanya tidak bisa
 *   dipandang terpisah
 * - Partikel mengalir: metafora visual "sesuatu menghubungkan keduanya"
 * - Kecepatan lambat-moderat: membantu orang awam membaca korelasinya
 */

export default function EntanglementPair() {
  // Referensi dua qubit & partikel
  const q1Ref = useRef<THREE.Group>(null!)
  const q2Ref = useRef<THREE.Group>(null!)
  const mat1Ref = useRef<THREE.MeshStandardMaterial>(null!)
  const mat2Ref = useRef<THREE.MeshStandardMaterial>(null!)
  const particleRef = useRef<THREE.Mesh>(null!)
  const flowRef = useRef(0)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    // Sinyal korelasi yang sama untuk kedua qubit → SINKRON
    // wave ∈ [-1, 1], period ~4s (lambat, jelas)
    const wave = Math.sin(t * Math.PI * 0.5)

    // Denyut skala: keduanya menyusut/membesar bersamaan
    const pulse = 1 + wave * 0.08
    q1Ref.current.scale.setScalar(pulse)
    q2Ref.current.scale.setScalar(pulse)

    // Warna sinkron: interpolasi biru (wave=-1) ↔ ungu (wave=+1)
    const c = new THREE.Color('#4A90E2').lerp(new THREE.Color('#9B51E0'), (wave + 1) / 2)
    mat1Ref.current.color.copy(c)
    mat1Ref.current.emissive.copy(c)
    mat2Ref.current.color.copy(c)
    mat2Ref.current.emissive.copy(c)

    // Partikel mengalir maju-mundur di antara dua qubit
    // Mulai dari kiri (-1.2) mengalir ke kanan (1.2), dipantulkan via triangle wave
    flowRef.current += delta * 0.5
    const tri = 1 - Math.abs(((flowRef.current % 2) - 1) * 2) // 0→1→0
    const px = -1.2 + tri * 2.4
    if (particleRef.current) {
      particleRef.current.position.x = px
      // Ukuran partikel sedikit mengecil di ujung (mengalir "masuk" ke qubit)
      const shrink = 0.6 + tri * 0.4
      particleRef.current.scale.setScalar(shrink)
    }
  })

  // Posisi dua qubit: kiri dan kanan, jarak cukup untuk terlihat terpisah
  const Q1_POS: [number, number, number] = [-1.2, 0, 0]
  const Q2_POS: [number, number, number] = [1.2, 0, 0]

  return (
    <group>
      {/* Qubit kiri */}
      <group ref={q1Ref} position={Q1_POS}>
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            ref={mat1Ref}
            color="#9B51E0"
            transparent
            opacity={0.85}
            roughness={0.3}
            metalness={0.7}
            emissive="#9B51E0"
            emissiveIntensity={0.25}
          />
        </mesh>
        <lineSegments>
          <sphereGeometry args={[0.51, 32, 32]} />
          <wireframeGeometry args={[new THREE.SphereGeometry(0.5, 32, 32)]} />
          <lineBasicMaterial color="#FFFFFF" opacity={0.3} transparent depthWrite={false} />
        </lineSegments>
      </group>

      {/* Qubit kanan */}
      <group ref={q2Ref} position={Q2_POS}>
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            ref={mat2Ref}
            color="#9B51E0"
            transparent
            opacity={0.85}
            roughness={0.3}
            metalness={0.7}
            emissive="#9B51E0"
            emissiveIntensity={0.25}
          />
        </mesh>
        <lineSegments>
          <sphereGeometry args={[0.51, 32, 32]} />
          <wireframeGeometry args={[new THREE.SphereGeometry(0.5, 32, 32)]} />
          <lineBasicMaterial color="#FFFFFF" opacity={0.3} transparent depthWrite={false} />
        </lineSegments>
      </group>

      {/* Garis penghubung (keterikatan antar qubit) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([-1.2, 0, 0, 1.2, 0, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#9B51E0" opacity={0.4} transparent linewidth={1} />
      </line>

      {/* Partikel mengalir di antara keduanya */}
      <mesh ref={particleRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#7A6BF0"
          emissive="#7A6BF0"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>
    </group>
  )
}