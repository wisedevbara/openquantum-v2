import Scene from '@/components/three/Scene'
import QubitSphere from '@/components/three/primitives/QubitSphere'

/**
 * Test page for Scene + QubitSphere integration
 * This page renders the reusable Scene container with the QubitSphere primitive
 * to verify 3D rendering, lighting, and OrbitControls interaction work correctly.
 */

export default function TestScenePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Quantum Computing Visualization Test
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Orbit the sphere with your mouse to interact. 
          The rotation represents quantum superposition.
        </p>
        
        {/* 3D Canvas - Scene is reusable, QubitSphere is a primitive */}
        <div className="bg-white rounded-xl shadow-lg p-4" style={{ height: '500px' }}>
          <Scene>
            <QubitSphere />
          </Scene>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>✅ Drag to rotate • ✅ Scroll to zoom</p>
        </div>
      </div>
    </main>
  )
}
