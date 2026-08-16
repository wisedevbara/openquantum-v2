'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { ReactNode, Suspense } from 'react'

/**
 * Scene.tsx - Reusable 3D canvas wrapper for quantum concept visualizations
 * 
 * This component provides:
 * - Transparent background (no visible canvas floor)
 * - Standard lighting setup (ambient + directional)
 * - OrbitControls for mouse interaction
 * - Proper camera positioning for small-scale quantum objects
 * - Suspense boundary for async loading of future GLB models
 * 
 * Accepts children prop to allow different quantum concepts to be rendered
 * without modifying this base Scene component.
 */

interface SceneProps {
  children?: ReactNode
}

export default function Scene({ children }: SceneProps) {
  return (
    <Canvas
      // Transparent background so it blends with page UI
      gl={{ antialias: true, alpha: true }}
      camera={{ 
        position: [0, 0, 4], 
        fov: 50, 
        near: 0.1, 
        far: 100 
      }}
    >
      {/* Suspense for async loading (future GLB models from Sketchfab) */}
      <Suspense fallback={null}>
        {/* Environment provides indirect lighting - minimal preset for clean look */}
        <Environment preset="apartment" />
        
        {/* Lighting setup optimized for small-scale quantum visualizations */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.8} 
          castShadow 
        />
        
        {/* The actual visualization content goes here */}
        {children}
        
        {/* Mouse controls for interactivity */}
        <OrbitControls 
          enableDamping={true}
          enablePan={false}
          minDistance={2}
          maxDistance={10}
          autoRotate={false}
        />
      </Suspense>
    </Canvas>
  )
}