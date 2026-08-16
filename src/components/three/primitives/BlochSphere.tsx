'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * BlochSphere.tsx - Primitive placeholder representing a Bloch sphere
 * 
 * Bloch sphere adalah cara standar memvisualisasikan state sebuah qubit:
 * satu titik/vektor pada permukaan bola, di mana posisi menentukan |0⟩, |1⟩,
 * dan kombinasi superposisinya.
 * 
 * Visual Design:
 * - Bola transparan + wireframe = "permukaan ruang state"
 * - Vektor dari pusat ke permukaan + titik di ujung = state qubit saat ini
 * - Sumbu X (merah), Y (hijau), Z (biru) untuk orientasi
 * - Presesi lambat vektor = perubahan fase φ yang dinamis tapi tidak membingungkan
 * 
 * Design Rationale (konsisten gaya QubitSphere):
 * - Skema biru-ungu untuk vektor berlalu dari |0⟩ (biru) ke |1⟩ (ungu)
 * - Transparansi bola mempertahankan fokus pada vektor state
 * - Presesi δφ=0.4 rad/s: cukup lambat untuk jelas, cukup dinamis agar terasa
 *   "hidup" — menghindari kerancuan makna (target orang awam)
 */

export default function BlochSphere() {
  // Referensi elemen yang dianimasikan
  const vectorRef = useRef<THREE.LineSegments>(null!)
  const tipRef = useRef<THREE.Mesh>(null!)
  const phiRef = useRef(0)

  useFrame((state, delta) => {
    // Presesi lambat: θ tetap (60°), φ maju perlahan → vektor mengelilingi bola
    // θ=60° memberi superposisi yang jelas (bukan murni |0⟩ atau |1⟩)
    const theta = Math.PI / 3
    phiRef.current += 0.4 * delta
    const phi = phiRef.current

    // Koordinat bola → Kartesian untuk satu titik pada permukaan (radius 1)
    const tip = new THREE.Vector3(
      Math.sin(theta) * Math.cos(phi),
      Math.cos(theta),
      Math.sin(theta) * Math.sin(phi)
    )

    // Update garis vektor dari origin (0,0,0) ke tip (lineSegments = 2 titik)
    const pos = vectorRef.current.geometry.attributes.position
    pos.setXYZ(0, 0, 0, 0)
    pos.setXYZ(1, tip.x, tip.y, tip.z)
    pos.needsUpdate = true

    // Update posisi titik di ujung vektor
    tipRef.current.position.copy(tip)

    // Warna tip: interpolasi biru (|0⟩) ↔ ungu (|1⟩) berdasarkan ketinggian Y
    const t = (tip.y + 1) / 2 // normalize [-1,1] → [0,1]
    const c = new THREE.Color('#4A90E2').lerp(new THREE.Color('#9B51E0'), t)
    const mat = tipRef.current.material as THREE.MeshStandardMaterial
    mat.color.copy(c)
    mat.emissive.copy(c)
  })

  return (
    <group>
      {/* Permukaan bola transparan */}
      <mesh>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial
          color="#4A90E2"
          transparent
          opacity={0.15}
          roughness={0.3}
          metalness={0.7}
          emissive="#4A90E2"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Wireframe overlay bola */}
      <lineSegments>
        <sphereGeometry args={[1.01, 32, 32]} />
        <wireframeGeometry args={[new THREE.SphereGeometry(1, 32, 32)]} />
        <lineBasicMaterial color="#FFFFFF" opacity={0.15} transparent depthWrite={false} />
      </lineSegments>

      {/* Sumbu koordinat X, Y, Z (tanpa label — teks 3D terlalu berat utk tahap ini) */}
      <Axes />

      {/* Vektor state qubit (lineSegments: origin → tip), diperbarui per-frame */}
      <lineSegments ref={vectorRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(6), 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#7A6BF0" />
      </lineSegments>

      {/* Titik di ujung vektor */}
      <mesh ref={tipRef}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color="#4A90E2"
          emissive="#4A90E2"
          emissiveIntensity={0.6}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
    </group>
  )
}

/**
 * Sumbu koordinat sederhana: X merah, Y hijau, Z biru.
 * Garis pendek dari origin, dengan ujung runcing (cone) menandakan arah positif.
 */
function Axes() {
  const posAxes = [
    { end: [1.15, 0, 0], color: '#ff4444' },
    { end: [0, 1.15, 0], color: '#44ff88' },
    { end: [0, 0, 1.15], color: '#4488ff' },
  ]
  const negAxes = [
    { end: [-0.7, 0, 0], color: '#ff4444' },
    { end: [0, -0.7, 0], color: '#44ff88' },
    { end: [0, 0, -0.7], color: '#4488ff' },
  ]

  return (
    <group>
      {/* Sumbu positif dengan ujung runcing */}
      {posAxes.map((a, i) => (
        <group key={`pos-${i}`}>
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array([0, 0, 0, a.end[0], a.end[1], a.end[2]]), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial color={a.color} />
          </lineSegments>
          <mesh position={[a.end[0], a.end[1], a.end[2]]}>
            <coneGeometry args={[0.03, 0.08, 8]} />
            <meshStandardMaterial color={a.color} emissive={a.color} emissiveIntensity={0.3} />
          </mesh>
        </group>
      ))}
      {/* Sumbu negatif (samar) */}
      {negAxes.map((a, i) => (
        <lineSegments key={`neg-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([0, 0, 0, a.end[0], a.end[1], a.end[2]]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={a.color} opacity={0.3} transparent />
        </lineSegments>
      ))}
    </group>
  )
}