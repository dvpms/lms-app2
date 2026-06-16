# CeriaEdu - Setup dan Panduan Singkat

> README ini menjelaskan cara menyiapkan lingkungan pengembangan untuk proyek `ceria-edu-lms`.

## Prasyarat
- Node.js (direkomendasikan v18+)
- pnpm (jika belum terpasang):

```bash
npm install -g pnpm
```
- Akses ke database (Postgres, Neon, dsb.) dan nilai `DATABASE_URL` yang valid.

## Instalasi dependencies

1. Clone repo dan masuk ke folder proyek.

```bash
pnpm install
```

> Catatan: `postinstall` akan menjalankan `prisma migrate deploy` dan `prisma generate` sesuai konfigurasi `package.json`.

## Variabel lingkungan

- Buat file `.env` (untuk development lokal) di root proyek. Minimal diperlukan:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
# Tambahkan variabel lain sesuai kebutuhan (cloudinary, next auth, dsb.)
```

- Untuk produksi gunakan `.env.prod` (repo sudah menyertakan skrip yang membaca `.env.prod` untuk seed/migrate produksi).

## Database (Prisma)

1. Terapkan migrasi (deploy):

```bash
pnpm migrate
```

2. (Opsional) Jika butuh mengisi contoh data / seed:

```bash
pnpm seed
# atau untuk seed game khusus
pnpm seed:games
```

Untuk environment produksi gunakan `pnpm seed:prod` atau `pnpm seed:games:prod`.

## Menjalankan aplikasi (development)

```bash
pnpm dev
```

Server development berjalan pada port `3012` (lihat `package.json` — `next dev -p 3012`).

## Build & Jalankan (produksi)

```bash
pnpm build
pnpm start
```

## Test & Lint

```bash
pnpm test        # jalankan test sekali
pnpm test:watch  # jalankan test dalam mode watch
pnpm lint        # eslint
```

## Skrip Penting (ringkasan dari `package.json`)
- `pnpm dev` — jalankan Next.js dalam mode development (port 3012)
- `pnpm build` — buat bundle produksi
- `pnpm start` — jalankan server produksi
- `pnpm migrate` — terapkan migrasi Prisma
- `pnpm seed` / `pnpm seed:games` — isi data awal
- `pnpm test` / `pnpm test:watch` — jalankan test dengan Vitest

## Catatan Tambahan
- Jika menggunakan layanan database eksternal (Neon, Heroku, dsb.), pastikan `DATABASE_URL` berisi string koneksi yang benar.
- Jika ada masalah setelah `pnpm install`, jalankan `pnpm install --shamefully-hoist` hanya jika benar-benar diperlukan untuk dependency yang bermasalah.
- Postinstall otomatis akan menjalankan migrasi; untuk alur development lokal alternatif, Anda bisa menonaktifkan postinstall atau menyesuaikan sesuai kebutuhan.

---
