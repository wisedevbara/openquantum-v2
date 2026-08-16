'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { ReactNode, Suspense } from 'react'

/**
 * Scene.tsx - Reusable 3D canvas wrapper for quantum concept visualizations
 * 
 * This component provides:
 * - Transparent background (no visible canvas floor)
 * - Self-contained lighting (ambient + directional + hemisphere) — NO external
 *   HDR asset fetch, so 3D renders resolve even when CDN/network is restricted
 * - OrbitControls for mouse interaction
 * - Proper camera positioning for small-scale quantum objects
 * - Suspense boundary for async loading of future GLB models
 * 
 * Accepts children prop to allow different quantum concepts to be rendered
 * without modifying this base Scene component.
 * 
 * NOTE: The drei <Environment preset> was removed because it fetches an HDR
 * file (lebombo_1k.hdr) from a remote CDN at runtime, causing "Failed to fetch"
 * when network/Cloudflare blocks it — leaving an empty canvas. Self-contained
 * lights keep 3D working offline/static.
 */

interface SceneProps {
  children?: ReactNode
}

export default function Scene({ children }: SceneProps) {
  return (
    <Canvas
      // Transparent background so it blends with page UI
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 4], fov: 50, near: 0.1, far: 100 }}
      dpr={[1, 2]}
    >
      {/* Suspense for async loading (future GLB models from Sketchfab) */}
      <Suspense fallback={null}>
        {/* Self-contained lighting — no network dependency.
            ambient: base fill • hemisphere: sky/ground tint • directional: key light */}
        <ambientLight intensity={0.55} />
        <hemisphereLight args={['#b6d3ff', '#2a2440', 0.5]} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />

        {/* The actual visualization content goes here */}
        {children}

        {/* Mouse controls for interactivity */}
        <OrbitControls
          enableDamping
          enablePan={false}
          minDistance={2}
          maxDistance={10}
          autoRotate={false}
        />
      </Suspense>
    </Canvas>
  )
}