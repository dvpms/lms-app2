# 🔧 Tailwind CSS v4.2.2 - Troubleshooting & Testing

## ⚠️ Langkah-Langkah untuk Mengatasi Style yang Tidak Muncul

### 1️⃣ **Clear Build Cache & Restart Server**

Di PowerShell, jalankan:
```powershell
# Stop dev server terlebih dahulu (Ctrl+C)

# Clear Next.js cache
Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue

# Clear browser cache (optional tapi recommended)
# Chrome/Edge: Ctrl+Shift+Delete

# Restart dev server
npm run dev
```

### 2️⃣ **Hard Refresh Browser**
- **Windows/Linux:** `Ctrl + Shift + R`
- **Mac:** `Cmd + Shift + R`

### 3️⃣ **Verifikasi CSS Sudah Ter-Inject**

Buka DevTools (`F12`) dan periksa:

1. **Sources tab → top-level domain**
   - Cari file bernama `_document.css` atau stylesheet dari `//_next/`
   - Harus ada content dari Tailwind

2. **Elements/Inspector tab**
   - Klik element dengan class Tailwind (misal `bg-blue-500`)
   - Di Styles panel, cek apakah ada rule CSS yang match
   - Jika ada rule dengan property seperti `background-color`, CSS sudah bekerja ✅

3. **Console tab**
   - Lihat apakah ada error message
   - Jika ada error dari Tailwind atau PostCSS, error akan muncul di sini

---

## 📋 **Checklist Konfigurasi**

| File | Status | Deskripsi |
|------|--------|-----------|
| `package.json` | ✅ | Sudah ada `"@tailwindcss/postcss": "4.2.2"` dan `"tailwindcss": "4.2.2"` |
| `postcss.config.mjs` | ✅ | Sudah setup dengan @tailwindcss/postcss plugin |
| `tailwind.config.js` | ✅ | Content paths: `./src/app/**`, `./src/components/**` |
| `src/app/globals.css` | ✅ | Import: `@import "tailwindcss";` |
| `src/app/layout.js` | ✅ | Import globals.css: `import './globals.css'` |

---

## 🧪 **Test dengan Simple Element**

Buat test ini di halaman mana saja (misal dashboard):

```jsx
export default function TestPage() {
  return (
    <div className="bg-blue-500 p-4 text-white rounded">
      ✅ Jika text ini ada di background biru = CSS BEKERJA!
    </div>
  )
}
```

Atau test dengan custom color dari @theme:
```jsx
<div className="bg-primary text-on-primary p-4">
  ✅ Primary color dari @theme
</div>
```

---

## 🔍 **Jika Masalah Masih Ada**

### Gejala 1: CSS tidak ada di DevTools
**Solusi:**
```powershell
# Hapus node_modules dan reinstall
Remove-Item -Path node_modules -Recurse -Force
Remove-Item -Path pnpm-lock.yaml
pnpm install
npm run dev
```

### Gejala 2: CSS ada tapi tidak ter-apply
**Solusi:**
- Pastikan tidak ada CSS yang lebih specific mengoverride Tailwind
- Cek apakah ada other global CSS yang conflicting
- Restart browser sepenuhnya (bukan hanya refresh)

### Gejala 3: Build error terkait Tailwind
**Solusi:**
```powershell
# Cek versi dependencies
npm ls @tailwindcss/postcss
npm ls tailwindcss
npm ls postcss

# Jika ada mismatch, force reinstall specific version
pnpm install @tailwindcss/postcss@4.2.2 tailwindcss@4.2.2 --force
npm run dev
```

---

## 📞 **Jika Masih Tidak Bekerja, Cek:**

1. ✅ Terminal output saat `npm run dev` - ada error?
2. ✅ DevTools Console - ada error message?
3. ✅ DevTools Sources - ada CSS file dari Tailwind?
4. ✅ File-file konfigurasi - ada typo?

---

## 🎯 **Quick Debug Command**

Jalankan ini di terminal untuk check Tailwind installation:
```powershell
# Cek apakah Tailwind CLI bisa dijalankan
npx tailwindcss --version

# Jika ada versi output = instalasi OK ✅
```

---

**Report:** Setelah melakukan langkah-langkah di atas, silakan share:
- Screenshot DevTools (Elements tab) yang menunjukkan CSS rules
- Terminal output dari `npm run dev`
- Exact error message jika ada
