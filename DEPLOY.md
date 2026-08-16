# OpenQuantum V2 — Deployment Guide

Dokumen ini memandu satu-perintah deploy ke VPS melalui GitHub Actions (deploy.yml)
ATAU manual via SSH. Gunakan tolok ukur: setiap langkah diverifikasi sebelum lanjut.

---

## Prasyarat (WAJIB — hanya Anda yang punya akses)

### 1. VPS & SSH
- Server Tencent Cloud Jakarta (production)
- Instal Docker + docker compose di VPS
- **Verifikasi SSH bisa jalan dari environment Anda** (bukan dari sini — host Hermes ini tidak bisa reach `43.133.154.14:22` saat test, kemungkinan security group/region):
  ```bash
  ssh -i ~/.ssh/id_ed25519 root@<IP_VPS> "docker --version"
  ```
Jika timeout: buka port 22 (security group Tencent) untuk IP Anda.

### 2. GitHub Secrets (dipakai deploy.yml)
Buat 3 secrets di repo openquantum-v2 → Settings → Secrets and variables → Actions:
| Secret | Nilai |
|--------|-------|
| `DEPLOY_HOST` | IP VPS |
| `DEPLOY_USER` | user SSH (mis. `root`) |
| `DEPLOY_KEY` | isi *private key* SSH (mulai `-----BEGIN OPENSSH PRIVATE KEY-----`) |

### 3. Domain & DNS
- A record `openquantum.id` → IP VPS di panel DNS (Domainesia/DNS provider)
- Let's Encrypt di VPS (route HTTP-01 di nginx.conf sudah siap)

---

## Langkah (urutan direkomendasikan)

### 1. Siapkan secrets GitHub
```bash
# CLI alternatif (setelah token dengan scope repo,workflow,read:org)
gh secret set DEPLOY_HOST --repo wisedevbara/openquantum-v2
gh secret set DEPLOY_USER --repo wisedevbara/openquantum-v2
gh secret set DEPLOY_KEY --repo wisedevbara/openquantum-v2
```
> Catatan: token `BARA-AI` saat ini **kurang scope `read:org`** untuk `gh secret set`. Bisa pakai UI repo, atau regen token add `repo` penuh + `workflow` + `read:org`.

### 2. Inisialisasi VPS satu kali
```bash
# di environment Anda yang bisa SSH ke VPS (host LOKAL komunitas Anda)
scp -r /root/openquantum-v2 root@<IPPS>:/opt/
ssh root@<IPPS> "cd /opt/openquantum-v2 && cp .env.example .env 2>/dev/null; docker compose -f docker-compose.yml up --build -d app-prod"
```

### 3. Deploy otomatis (via Actions)
- Push ke master → di `Actions` → "Deploy OpenQuantum V2" → Run workflow
- atau `git tag` + manual run`workflow_dispatch`

### 4. Verifikasi
```bash
curl -sk https://openquantum.id/ -o /dev/null -w "%{http_code}\n"   # → 200
curl -sI https://openquantum.id/models/qubit.glb | grep -i cache-control  # cache
```

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| CI "No pnpm version" | sudah fix: `packageManager: pnpm@9.15.4` di package.json |
| CI "packages field missing" | sudah fix: hapus `pnpm-workspace.yaml` invalid |
| nginx cert-load error saat `-t` | normal pra-deploy, hanya perlu Let's Encrypt cert |
| Port 80 conflict (Caddy lama) | matikan service/container lain di VPS sebelum up |

## Catatan Keamanan
- Jangan commit secret ke repo (`.env` ter-ignore)
- Private key SSH `chmod 600`
- Gunakan `${DEPLOY_*}` di workflow, jangan hardcode
- Verifikasi `git log --all -p | grep password` sebelum push