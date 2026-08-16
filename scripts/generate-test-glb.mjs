// Generator test minimal valid GLB (binary).
// Membangun GLB sederhana (segitiga) dengan menulis format biner GLB2 secara manual,
// untuk membuktikan pipeline useGLTF/GLBModel berfungsi end-to-end.
// File asli dari Sketchfab akan menggantikan ini di produksi.
import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'public', 'models')
mkdirSync(outDir, { recursive: true })

// Segitiga: 3 vertex posisi (x,y,z float32) — non-indexed
const positions = new Float32Array([
  0, 1, 0, // vertex 0
  -1, -1, 0, // vertex 1
  1, -1, 0, // vertex 2
])

// Buffers: 1 BIN buffer berisi posisi (36 bytes)
const binBuffer = Buffer.from(positions.buffer)

// JSON chunk (GLTF 2.0)
const gltf = {
  asset: { version: '2.0', generator: 'openquantum-test' },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ mesh: 0, name: 'QubitTriangle' }],
  meshes: [
    {
      primitives: [
        {
          attributes: { POSITION: 0 },
          mode: 4, // TRIANGLES
        },
      ],
      name: 'QubitMesh',
    },
  ],
  accessors: [
    {
      bufferView: 0,
      componentType: 5126, // FLOAT
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

// Pad JSON chunk ke 4-byte alignment
const jsonPadded = pad4(jsonBuffer)
const binPadded = pad4(binBuffer)

const totalLen = 12 + 8 + jsonPadded.length + 8 + binPadded.length

// GLB header
const header = Buffer.alloc(12)
header.write('glTF', 0, 'ascii')
header.writeUInt32LE(2, 4) // version
header.writeUInt32LE(totalLen, 8) // total length

// Chunk 0: JSON (chunkLength = panjang data asli, data dipad ke 4 bytes)
const jsonChunk = Buffer.alloc(8 + jsonPadded.length)
jsonChunk.writeUInt32LE(jsonBuffer.length, 0)
jsonChunk.write('JSON', 4, 'ascii')
jsonPadded.copy(jsonChunk, 8)

// Chunk 1: BIN (chunkLength = panjang data asli, data dipad ke 4 bytes)
const binChunk = Buffer.alloc(8 + binPadded.length)
binChunk.writeUInt32LE(binBuffer.length, 0)
binChunk.write('BIN\0', 4, 'ascii')
binPadded.copy(binChunk, 8)

const glb = Buffer.concat([header, jsonChunk, binChunk])
const path = join(outDir, 'qubit.glb')
writeFileSync(path, glb)

console.log(`GLB written: ${path} (${glb.length} bytes)`)
console.log('Magic header:', glb.slice(0, 4).toString(), '| version', glb.readUInt32LE(4))

function pad4(buf) {
  const rem = buf.length % 4
  return rem === 0 ? buf : Buffer.concat([buf, Buffer.alloc(4 - rem)])
}