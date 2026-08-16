# OpenQuantum V2

> **⚛️ Quantum Computing Learning Platform with Interactive 3D Visualizations**

OpenQuantum V2 adalah platform pembelajaran quantum computing interaktif yang menggabungkan konsep teori dengan visualisasi 3D menggunakan Three.js (React Three Fiber). Ditujukan untuk pemula hingga profesional yang ingin memahami konsep kuantum secara intuitif dan immersif.

---

## ✨ Fitur

- **Visualisasi 3D Interaktif** — eksplorasi qubit, Bloch sphere, dan entanglement melalui kanvas WebGL yang bisa diputar & di-orbit
- **3D mandiri / offline-friendly** — lighting self-contained (tanpa fetch aset HDR eksternal), sehingga visual tetap tampil di jaringan dengan kendala (region/Cloudflare)
- **MDX dengan embedding komponen React** — komponen 3D bisa diselipkan langsung di tengah teks artikel & konsep, bukan sekadar ilustrasi terpisah
- **Belajar bertahap** — dari konsep dasar hingga topik lanjutan, disusun sistematis
- **Config-driven visual** — `concept-visuals.ts` memetakan id konsep → primitive atau GLB (siap-upgrade tanpa ubah halaman)
- **Prototipe dengan placeholder Three.js**, rencana integrasi model GLB dari [Sketchfab](https://sketchfab.com)

## 📌 Struktur

```
openquantum-v2/
├── src/
│   ├── app/
│   │   ├── layout.tsx / page.tsx / globals.css
│   │   ├── artikel/          # listing + detail artikel (MDX)
│   │   └── konsep/           # listing + detail konsep (hero 3D + body MDX)
│   ├── components/
│   │   ├── three/            # Scene, ConceptModel, primitives, loaders (GLB)
│   │   ├── mdx/              # MDXComponents, InteractiveQubit
│   │   └── ui/               # nav, footer, UI non-3D
│   ├── content/              # artikel/*.mdx dan konsep/*.mdx
│   ├── config/               # concept-visuals.ts (mapping visual)
│   └── lib/                  # mdx.ts (baca & compile MDX), utils
├── public/models/            # model GLB (placeholder saat ini)
├── .github/workflows/        # CI + deploy blueprint
├── scripts/                  # generate-test-glb.mjs, compress-models.sh
├── Dockerfile / Dockerfile.dev / docker-compose.yml / nginx.conf
└── DEPLOY.md                 # panduan deployment satu-perintah
```

## 🚀 Teknologi (versi aktual)

| Layer | Tech |
|-------|------|
| Framework | Next.js **15** (App Router) |
| React | **19** |
| 3D | Three.js + **@react-three/fiber** + **@react-three/drei** |
| Styling | **Tailwind CSS 4** (+ @tailwindcss/typography) |
| Konten | MDX via **next-mdx-remote/rsc** + gray-matter + remark-gfm |
| Deploy | Docker multi-stage + docker compose + Nginx/TLS |

## 🛠️ Pengembangan

### Prasyarat
- Node.js 22+, pnpm 9+

### Jalankan Lokal (development)
```bash
git clone https://github.com/wisedevbara/openquantum-v2.git
cd openquantum-v2
pnpm install
pnpm dev            # → http://localhost:3000
```

### Production (standalone, di Docker)
```bash
# 1) build & jalankan production image
docker compose -f docker-compose.yml up --build -d app-prod

# 2) verifikasi
curl -s http://localhost:3000/ -o /dev/null -w "%{http_code}\n"   # 200

# 3) full stack dev + production + nginx:
docker compose up -d app-dev      # dev hot-reload
docker compose --profile production up -d   # app-prod + nginx
```

### CI / CD
- **CI** (github-actions): `pnpm install → lint → build (SSG) → docker image verify → static routes`, jalan tiap push/master
- **Deploy** (blueprint): `deploy.yml` — workflow manual SSH via secrets `DEPLOY_HOST / DEPLOY_USER / DEPLOY_KEY`
- Lihat **`DEPLOY.md`** untuk langkah lengkap (secrets, DNS, Let's Encrypt).

## 📋 Roadmap

| Fase | Status | Deskripsi |
|------|--------|-----------|
| ✅ Phase 1 | Selesai | Struktur project + folder layout + routing artikel/konsep |
| ✅ Phase 2 | Selesai | Komponen Three.js dasar (Scene, QubitSphere, BlochSphere, EntanglementPair, ConceptModel) |
| ⏳ Phase 3 | Sebagian | Pipeline GLB terbukti (placeholder) — **menunggu model Sketchfab asli** |
| ✅ Phase 4 | Selesai | Interaktivitas: InteractiveQubit (slider + collapse) |
| 🔄 Phase 5 | Berjalan | Deployment & optimasi performa (Docker, prod hardening, CI/CD) |

## 🌐 Deployment / Domain

- **Production image** aktif dan terverifikasi (`openquantum-v2:prod`, standalone, SSG).
- **CI/CD** hijau di GitHub Actions.
- **Rencana**: menggantikan `openquantum.id` saat ini; reverse-proxy + TLS via Nginx + Let's Encrypt (`nginx.conf` + `docker-compose` production profile).
- **Source model 3D**: primitive sekarang; upgrade ke **GLB dari Sketchfab** setelah prototype & model dipilih.

## 👥 Author

- **Bara** — [@BaraMigSpace](https://x.com/BaraMigSpace)
- Project di-develop untuk **openquantum.id**

## 📄 Lisensi

MIT — selengkapnya di `LICENSE`.

---

*OpenQuantum V2 — Belajar quantum computing tidak pernah semudah ini.*