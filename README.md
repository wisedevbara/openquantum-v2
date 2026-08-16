# OpenQuantum V2

> **⚛️ Quantum Computing Learning Platform with Interactive 3D Visualizations**

OpenQuantum V2 adalah platform pembelajaran quantum computing interaktif yang menggabungkan konsep teori dengan visualisasi 3D menggunakan Three.js. Platform ini dirancang untuk pemula hingga profesional yang ingin memahami konsep kuantum melalui pengalaman belajar yang immersif.

## ✨ Fitur

- **Visualisasi 3D Interaktif**: Eksplorasi konsep kuantum seperti qubit, Bloch sphere, dan entanglement melalui model 3D yang dapat diputar dan diinteraksikan
- **Belajar Bertahap**: Mulai dari konsep dasar hingga topik lanjutan, disusun secara sistematis
- **Prototipe Early Stage**: Penggunaan primitive placeholder Three.js untuk pengembangan cepat
- **Rencana Integrasi Sketchfab**: Model GLB high-quality akan ditambahkan dari [Sketchfab](http://sketchfab.com) setelah prototype matang

## 🏗️ Arsitektur

Project ini menggunakan struktur modular:

```
openquantum-v2/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (font, metadata, providers)
│   │   ├── page.tsx            # Homepage
│   │   ├── globals.css
│   │   ├── artikel/            # Blog/artikel quantum computing
│   │   └── konsep/             # Halaman konsep interaktif dengan visualisasi 3D
│   ├── components/
│   │   ├── three/              # Komponen Three.js untuk visualisasi 3D
│   │   │   ├── ConceptModel.tsx        # Wrapper untuk render primitive/GLB
│   │   │   ├── primitives/             # Model primitif (QubitSphere, BlochSphere, dll)
│   │   │   ├── loaders/                # Loader untuk model GLB
│   │   │   └── Scene.tsx               # Canvas + lighting + controls
│   │   ├── mdx/              # Komponen khusus untuk MDX
│   │   └── ui/               # Komponen UI non-3D
│   ├── content/              # Konten artikel dan konsep (MDX)
│   ├── config/               # Konfigurasi mapping konsep ke visual
│   └── lib/                  # Utilities
├── public/
│   └── models/               # Model GLB (akan ditambahkan nanti)
├── scripts/                  # Skrip utilitas
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🚀 Teknologi

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Visualisasi 3D**: [Three.js](https://threejs.org/) via [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Konten**: [MDX](https://mdxjs.com/) untuk artikel interaktif
- **Model 3D (future)**: [glTF/GLB](https://github.com/KhronosGroup/glTF) format

## 🛠️ Pengembangan

### Prasyarat

- Node.js 18+
- npm/yarn/pnpm

### Instalasi

```bash
# Clone repository
git clone https://github.com/wisedevbara/openquantum-v2.git
cd openquantum-v2

# Install dependencies
npm install

# Jalankan development server
npm run dev

# Buka http://localhost:3000 di browser
```

### Build Produksi

```bash
npm run build
npm start
```

## 📋 Roadmap

| Fase | Status | Deskripsi |
|------|--------|-----------|
| ✅ Phase 1 | Selesai | Struktur dasar project & folder layout |
| 🔄 Phase 2 | Berjalan | Implementasi komponen Three.js dasar |
| ⏳ Phase 3 | Rencana | Integrasi Sketchfab GLB models |
| ⏳ Phase 4 | Rencana | Interaktivitas lanjutan & animasi kuantum |
| ⏳ Phase 5 | Rencana | Deployment & optimasi performa |

## 🌐 Domain

- **Saat ini**: Prototype berisi placeholder primitif Three.js
- **Rencana akhir**: Menggantikan `openquantum.id` saat ini
- **Source model 3D**: Akan beralih ke format GLB dari [Sketchfab](http://sketchfab.com) setelah prototype siap

## 👥 Author

- **Bara** - [@BaraMigSpace](https://x.com/BaraMigSpace)
- Project dikembangkan untuk openquantum.id

## 📄 License

MIT License - lihat [LICENSE](LICENSE) untuk detail.

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buat Pull Request untuk perbaangan, fitur baru, atau perbaikan dokumentasi.

---

*OpenQuantum V2 - Belajar quantum computing tidak pernah semudah ini.*
