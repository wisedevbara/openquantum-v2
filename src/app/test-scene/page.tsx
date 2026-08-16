import Scene from '@/components/three/Scene'
import QubitSphere from '@/components/three/primitives/QubitSphere'
import BlochSphere from '@/components/three/primitives/BlochSphere'
import EntanglementPair from '@/components/three/primitives/EntanglementPair'
import ConceptModel from '@/components/three/ConceptModel'

/**
 * Test scene page - verifies all three 3D primitives render correctly
 * through the config-driven ConceptModel (not hardcoded).
 * 
 * Each primitive is displayed via <ConceptModel id="..." />, proving:
 * 1. concept-visuals.ts maps each id to the right component
 * 2. ConceptModel primitive map includes all three
 * 3. All can be orbited with the mouse
 */

export default function TestScenePage() {
  return (
    <main className="bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">
          Quantum Computing Visualization Test
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Primitive &amp; GLB dirender via <code className="bg-gray-100 px-1 rounded">ConceptModel</code>{' '}
          (config-driven). Orbit dengan mouse.
        </p>

        {/* Grid of the three concepts rendered via ConceptModel */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Qubit */}
          <ConceptCard id="qubit" title="Qubit" desc="Gradasi biru→ungu, rotasi mewakili superposisi" />

          {/* Bloch Sphere */}
          <ConceptCard id="blochSphere" title="Bloch Sphere" desc="Vektor state + sumbu X,Y,Z, presesi lambat" />

          {/* Entanglement Pair */}
          <ConceptCard id="entanglementPair" title="Entanglement" desc="Dua qubit berdenyut sinkron + partikel mengalir" />

          {/* Reference direct render (baseline) */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h2 className="text-lg font-semibold text-center mb-2">Direct (reference)</h2>
            <p className="text-center text-sm text-gray-500 mb-3">Scene + QubitSphere langsung</p>
            <div style={{ height: '280px' }}>
              <Scene>
                <QubitSphere />
              </Scene>
            </div>
          </div>
        </div>

        {/* GLB PIPELINE — bukti switching type:'glb' untuk semua konsep */}
        <h2 className="text-2xl font-bold mt-12 mb-4 text-center">Pipeline GLB (placeholder)</h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Memuat model GLB via <code className="bg-gray-100 px-1 rounded">GLBModel</code> — saat
          model Sketchfab siap, ganti file &amp; config tanpa ubah halaman.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <ConceptCard id="qubitGLB" title="Qubit (GLB)" desc="/models/qubit.glb" />
          <ConceptCard id="blochGLB" title="Bloch (GLB)" desc="/models/bloch-sphere.glb" />
          <ConceptCard id="entanglementGLB" title="Entanglement (GLB)" desc="/models/entanglement-pair.glb" />
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>✅ Drag to rotate • ✅ Scroll to zoom</p>
        </div>
      </div>
    </main>
  )
}

function ConceptCard({ id, title, desc }: { id: string; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h2 className="text-lg font-semibold text-center mb-1">{title}</h2>
      <p className="text-center text-sm text-gray-500 mb-3">{desc}</p>
      <div style={{ height: '280px' }}>
        <ConceptModel id={id} />
      </div>
    </div>
  )
}