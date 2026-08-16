'use client'

import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { ReactNode, Suspense } from 'react'

/**
 * Scene.tsx - Reusable 3D canvas wrapper for quantum concept visualizations
 *
 * Provides:
 * - Self-contained ENVIRONMENT + reflection (NO external HDR fetch): procedural
 *   <Environment> wrapping bright emissive <mesh> plane strips — generated in-GPU,
 *   offline-safe. Keeps metalness-heavy materials alive without CDN.
 * - Bloom post-processing (glow on emissive elements)
 * - Subtle Sparkles starfield for depth (low opacity, non-distracting)
 * - OrbitControls + reusable camera
 * - Accepts children (the concept primitive/GLB content)
 *
 * NOTE on Environment: the previous <Environment preset> was removed because it
 * downloaded lebombo_1k.hdr from a CDN which fails on restricted networks.
 * A procedural environment (children # meshes) generates PBR reflections purely
 * via GPU — ZERO network requests — so materials stay metallic-looking but
 * remain self-contained/offline-friendly.
 */

interface SceneProps {
  children?: ReactNode
}

export default function Scene({ children }: SceneProps) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 4], fov: 50, near: 0.1, far: 100 }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        {/* Procedural PBR environment for reflections — no network.
            Pinggir-pinggir ini adalah mesh polos bercahaya (emissive) yang
            dirender ke environment map oleh drei — TIDAK fetch HDR apa pun. */}
        <Environment resolution={32} frames={1}>
          {/* Thermal strip atas (biru terang) */}
          <mesh position={[0, 3, 2]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[8, 3]} />
            <meshBasicMaterial color="#b6d3ff" toneMapped={false} />
          </mesh>
          {/* Fill kiri (ungu) */}
          <mesh position={[-5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[8, 6]} />
            <meshBasicMaterial color="#9b51e0" toneMapped={false} />
          </mesh>
          {/* Rim kanan (biru) */}
          <mesh position={[5, 0, -1]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[8, 6]} />
            <meshBasicMaterial color="#4a90e2" toneMapped={false} />
          </mesh>
        </Environment>

        {/* Self-contained base lighting */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 5, 5]} intensity={0.4} />

        {/* Atmosphere: subtle distant particle field (low opacity, non-distracting) */}
        <Sparkles count={60} scale={6} size={1.2} speed={0.2} opacity={0.22} color="#8ab8ff" />

        {/* The actual visualization content goes here */}
        {children}

        {/* Mouse controls */}
        <OrbitControls enableDamping enablePan={false} minDistance={2} maxDistance={10} autoRotate={false} />

        {/* Post-processing Bloom — subtle glow on emissive parts only */}
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.4}
            luminanceThreshold={0.35}
            luminanceSmoothing={0.3}
            mipmapBlur
            radius={0.5}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}