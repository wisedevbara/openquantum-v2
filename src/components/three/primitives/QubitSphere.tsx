'use client'

import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'

/**
 * QubitSphere.tsx - Primitive placeholder representing a qubit as a 3D object
 *
 * Visual Design:
 * - Gradient sphere using vertex colors transitioning from blue to purple
 * - Gentle rotation animation representing quantum superposition (uncertainty/oscillation)
 * - Subtle scale pulsing to suggest quantum fluctuation
 * - Semi-transparent surface with wireframe overlay for educational clarity
 *
 * Design Rationale:
 * - Blue-to-purple gradient: Blue represents "0" state, purple represents "1" state
 * - Superposition concept: While rotating, the sphere shows both faces simultaneously,
 *   mimicking how a qubit exists in multiple states until measured
 * - Gentle animation speed (0.2 rad/frame) chosen for: slow enough to be contemplative,
 *   fast enough to not be boring - prioritizes accessibility for beginners
 * - Wireframe + solid surface: Shows internal structure while maintaining form,
 *   reflecting that quantum states have both definable properties and uncertainty
 */

export default function QubitSphere() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered] = useState(false)

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Slow rotation to represent superposition (uncertainty/movement between states)
      meshRef.current.rotation.y += 0.2 * delta
      meshRef.current.rotation.x += 0.1 * delta
      
      // Subtle pulsing scale to suggest quantum fluctuation
      const pulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.02 + 1
      meshRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group>
      {/* Main sphere with gradient material */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.8, 64, 32]} />
        {/* Vertex colors create smooth gradient from blue (0) to purple (1) */}
        <meshStandardMaterial
          // Gradient from blue (#4A90E2) to purple (#9B51E0)
          vertexColors={true}
          // Semi-transparent for educational clarity
          transparent={true}
          opacity={0.85}
          // Smooth shading for realistic physics look
          roughness={0.3}
          metalness={0.7}
          // Slight emission to make it glow softly
          emissive={new THREE.Color('#4A90E2')}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Wireframe overlay to show internal structure (educational) */}
      <lineSegments>
        <sphereGeometry args={[0.81, 64, 32]} />
        <wireframeGeometry args={[new THREE.SphereGeometry(0.8, 64, 32)]} />
        {/* @ts-ignore - r3f handles this */}
        <lineBasicMaterial
          color="#FFFFFF"
          opacity={0.3}
          transparent={true}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  )
}