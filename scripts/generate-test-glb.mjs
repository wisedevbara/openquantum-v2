// Generator placeholder GLB untuk 3 konsep — uji pipeline load model.
// File asli dari Sketchfab akan menggantikan ini di produksi.
// GLB2 binary manual: qubit (sphere+vector), bloch (sphere+axes), entanglement (2 spheres+line)
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'public', 'models')
mkdirSync(outDir, { recursive: true })

// --- Geometri dasar: sebuah segitiga (indeks tunggal primitive) sebagai mesh stand-in.
// Realistis: placeholder sederhana cukup untuk membuktikan loading; model asli dari Sketchfab
// memiliki geometri kompleks yang standar.

// Helper: bangun GLB dari nama file + warna material
function buildGLB(name, colorHEX) {
  const positions = new Float32Array([0, 1, 0, -1, -1, 0, 1, -1, 0])
  const binBuffer = Buffer.from(positions.buffer)
  const color = [((colorHEX >> 16) & 255) / 255, ((colorHEX >> 8) & 255) / 255, (colorHEX & 255) / 255]

  const gltf = {
    asset: { version: '2.0', generator: 'openquantum-placeholder' },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0, name }],
    meshes: [
      {
        primitives: [
          {
            attributes: { POSITION: 0 },
            mode: 4,
            material: 0,
          },
        ],
        name: `${name}Mesh`,
      },
    ],
    materials: [
      {
        name: `${name}Mat`,
        pbrMetallicRoughness: {
          baseColorFactor: [...color, 1.0],
          metallicFactor: 0.7,
          roughnessFactor: 0.3,
        },
      },
    ],
    accessors: [
      {
        bufferView: 0,
        componentType: 5126,
        count: 3,
        type: 'VEC3',
        min: [-1, -1, 0],
        max: [0, 1, 0],
      },
    ],
    bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: binBuffer.byteLength, target: 34962 }],
    buffers: [{ byteLength: binBuffer.byteLength }],
  }

  const jsonBuffer = Buffer.from(JSON.stringify(gltf))
  const jsonPadded = pad4(jsonBuffer)
  const binPadded = pad4(binBuffer)
  const totalLen = 12 + 8 + jsonPadded.length + 8 + binPadded.length

  const header = Buffer.alloc(12)
  header.write('glTF', 0, 'ascii')
  header.writeUInt32LE(2, 4)
  header.writeUInt32LE(totalLen, 8)

  const jsonChunk = Buffer.alloc(8 + jsonPadded.length)
  jsonChunk.writeUInt32LE(jsonBuffer.length, 0)
  jsonChunk.write('JSON', 4, 'ascii')
  jsonPadded.copy(jsonChunk, 8)

  const binChunk = Buffer.alloc(8 + binPadded.length)
  binChunk.writeUInt32LE(binBuffer.length, 0)
  binChunk.write('BIN\0', 4, 'ascii')
  binPadded.copy(binChunk, 8)

  const glb = Buffer.concat([header, jsonChunk, binChunk])
  const path = join(outDir, name)
  writeFileSync(path, glb)
  return { path, size: glb.length }
}

// Warna konsisten gaya visual: biru(#4A90E2=4879... ) & ungu(#9B51E0)
const BLUE = 0x4a90e2
const PURPLE = 0x9b51e0
const CYAN = 0x7a6bf0

const models = [
  buildGLB('qubit.glb', PURPLE),
  buildGLB('bloch-sphere.glb', BLUE),
  buildGLB('entanglement-pair.glb', CYAN),
]

console.log('Generated placeholder GLB models:')
for (const m of models) {
  console.log(`  ${m.path} (${m.size} bytes)`)
}

function pad4(buf) {
  const rem = buf.length % 4
  return rem === 0 ? buf : Buffer.concat([buf, Buffer.alloc(4 - rem)])
}