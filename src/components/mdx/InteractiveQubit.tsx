'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Scene from '@/components/three/Scene'

/**
 * InteractiveQubit.tsx - Qubit interaktif dengan simulasi pengukuran sederhana
 * 
 * Komponen MDX edukatif: pengguna bisa mengubah amplitudo (pra-superposisi),
 * lalu "mengukur" qubit untuk melihat hasil collapsing ke |0⟩ atau |1⟩.
 * Ini menyampaikan dua konsep inti:
 *   1. Superposisi — sebelum diukur, qubit berada dalam kombinasi |0⟩ & |1⟩
 *   2. Collapse / measurement — setelah diukur, state "jatuh" ke salah satu basis
 *
 * Hanya pakai useFrame + useRef (bawaan R3F), tanpa animasi eksternal.
 */

interface InteractiveQubitProps {
  /** caption yang ditampilkan di bawah kontrol */
  caption?: string
}

export default function InteractiveQubit({ caption }: InteractiveQubitProps) {
  // amplitudeBias ∈ [-1,1]: -1 = murni |0⟩, +1 = murni |1⟩, 0 = superposisi seimbang
  const [bias, setBias] = useState(0)
  // measured: null (belum diukur) | 0 (collapse ke |0⟩) | 1 (collapse ke |1⟩)
  const [measured, setMeasured] = useState<null | 0 | 1>(null)

  // Untuk animasi collapse ke state terukur
  const targetBias = useRef(0)

  const handleMeasure = () => {
    // Probabilitas ^2 — collapse mengikuti bias (deterministik untuk demo jelas)
    const p1 = (bias + 1) / 2
    const result = Math.random() < p1 ? 1 : 0
    setMeasured(result)
    targetBias.current = result === 1 ? 1 : -1
  }

  const reset = () => {
    setMeasured(null)
    setBias(0)
    targetBias.current = 0
  }

  return (
    <div className="my-8">
      <div className="rounded-xl overflow-hidden bg-slate-900 h-72 relative">
        <Scene>
          <QubitState bias={measured !== null ? targetBias.current : bias} measured={measured} />
        </Scene>

        {/* Badge state */}
        <div className="absolute top-3 left-3 bg-black/40 text-white text-xs px-2 py-1 rounded">
          {measured === null
            ? `State: ${formatState(bias)}`
            : measured === 1
            ? 'Hasil ukur: |1⟩'
            : 'Hasil ukur: |0⟩'}
        </div>

        {measured !== null && (
          <button
            onClick={reset}
            className="absolute top-3 right-3 bg-white/90 text-slate-900 text-xs px-2 py-1 rounded hover:bg-white"
          >
            Reset
          </button>
        )}
      </div>

      {/* Kontrol */}
      <div className="mt-3 bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            Amplitudo state (superposisi)
          </label>
          <span className="text-sm font-mono text-gray-500">
            {measured === null ? formatState(bias) : '—'}
          </span>
        </div>
        <input
          type="range"
          min={-1}
          max={1}
          step={0.05}
          value={measured !== null ? targetBias.current : bias}
          disabled={measured !== null}
          onChange={(e) => { setBias(parseFloat(e.target.value)); setMeasured(null); targetBias.current = 0 }}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>|0⟩</span>
          <span>Superposisi</span>
          <span>|1⟩</span>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleMeasure}
            disabled={measured !== null}
            className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-40"
          >
            Ukur qubit ⚡
          </button>
          <p className="text-xs text-gray-500">
            {measured === null
              ? 'Geser lalu "ukur" untuk melihat collapse ke salah satu state.'
              : 'State qubit sudah collapse. Klik Reset untuk mencoba lagi.'}
          </p>
        </div>
      </div>

      {caption && (
        <p className="mt-2 text-center text-sm text-gray-500 italic">{caption}</p>
      )}
    </div>
  )
}

/**
 * Bola qubit yang warnanya mencerminkan bias saat ini,
 * dan "collapse" (mengerut + miring) saat diukur.
 */
function QubitState({ bias, measured }: { bias: number; measured: null | 0 | 1 }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    const g = groupRef.current
    const m = meshRef.current
    if (!g || !m) return

    if (measured === null) {
      // Superposisi: rotasi halus + pulsing
      g.rotation.y += 0.3 * state.clock.getDelta()
      const pulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.03 + 1
      g.scale.setScalar(pulse)
    } else {
      // Collapse: miring ke arah state + sedikit mengecil (simulasi "jatuh ke basis")
      const targetRot = measured === 1 ? [0, 0, Math.PI] : [0, 0, 0]
      g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, targetRot[2], 0.08)
      g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, 0.9, 0.08))
    }
  })

  // Warna: biru (|0⟩) ↔ ungu (|1⟩)
  const color = new THREE.Color('#4A90E2').lerp(new THREE.Color('#9B51E0'), (bias + 1) / 2)

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.8, 64, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.85}
          roughness={0.3}
          metalness={0.7}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
      <lineSegments>
        <sphereGeometry args={[0.81, 32, 32]} />
        <wireframeGeometry args={[new THREE.SphereGeometry(0.8, 32, 32)]} />
        <lineBasicMaterial color="#FFFFFF" opacity={0.3} transparent depthWrite={false} />
      </lineSegments>
    </group>
  )
}

function formatState(bias: number): string {
  const alpha = ((1 - bias) / 2).toFixed(2)
  const beta = ((1 + bias) / 2).toFixed(2)
  return `${alpha}|0⟩ + ${beta}|1⟩`
}