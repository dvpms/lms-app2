# 🎨 Tailwind CSS v4.2.2 - Configuration Guide

## ✅ Konfigurasi yang Sudah Diperbaiki

### 1. **tailwind.config.js** (FILE BARU)
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**Mengapa penting?**
- Mendefinisikan **content paths** yang Tailwind harus scan
- Memastikan Tailwind menemukan semua file dengan class names
- Tanpa ini, Tailwind tidak tahu file mana yang harus diproses

### 2. **postcss.config.mjs** ✅ (Sudah Benar)
```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

**Status:** Sudah optimal untuk Tailwind v4

### 3. **src/app/globals.css** ✅ (Updated)
```css
@import "tailwindcss";
@layer base, components, utilities;

@theme {
  /* Design tokens - sudah benar */
  --color-surface: #f4fafd;
  /* ... custom colors ... */
  --font-sans: 'Lexend', sans-serif;
  /* ... */
}
```

**Perubahan:**
- ✅ Ditambahkan `@layer base, components, utilities;`
- ✅ Memastikan CSS layers sudah terdefinisi

### 4. **src/app/layout.js** ✅ (Sudah Benar)
```javascript
import './globals.css'
import { Lexend } from 'next/font/google'

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',  // Matches --font-sans in @theme
})

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={lexend.variable}>
      {/* ... */}
    </html>
  )
}
```

**Status:** Sudah sempurna! Font dan CSS variable sudah linked dengan benar.

---

## 🚀 Testing Checklist

Sebelum menjalankan dev server, pastikan:

```bash
# 1. Clean install dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# 2. Build Tailwind CSS
npm run build

# 3. Run dev server
npm run dev
```

## ✔️ Verifikasi Konfigurasi

Buka browser dan inspect element, pastikan:

1. **CSS sudah di-inject:**
   - Buka DevTools → Styles tab
   - Harus ada stylesheet dari Tailwind dengan class names

2. **Class names bekerja:**
   - Buat test: `<div class="bg-blue-500 p-4 text-white">`
   - Harus muncul styling biru dengan padding

3. **Custom colors dari @theme:**
   - Test: `<div class="bg-primary">`
   - Harus menampilkan warna primary dari --color-primary

---

## 📚 Referensi Resmi

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
- [Theme Variables Guide](https://tailwindcss.com/docs/theme)
- [Next.js Integration](https://tailwindcss.com/docs/installation/framework-guides/nextjs)

---

## 🔍 Troubleshooting

### Jika styles masih tidak muncul:

1. **Clear browser cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) atau `Cmd+Shift+R` (Mac)

2. **Check Next.js build:**
   - Lihat terminal untuk error messages
   - Pastikan tidak ada syntax errors di CSS

3. **Verify content paths:**
   - Edit `tailwind.config.js` dan tambahkan paths yang mungkin terlewat
   - Contoh: jika ada JSX di folder lain, tambahkan ke content array

4. **Check PostCSS:**
   - Verifikasi `postcss.config.mjs` syntax benar
   - Pastikan `@tailwindcss/postcss` terinstall: `npm ls @tailwindcss/postcss`

---

## 📝 Catatan Penting

**Tailwind CSS v4 vs v3 - Perbedaan Kunci:**

| Aspek | v3 | v4 |
|-------|----|----|
| tailwind.config.js | Required | Optional (tapi recommended) |
| globals.css | `@tailwind base, components, utilities;` | `@import "tailwindcss";` |
| @theme | ❌ Tidak ada | ✅ Ada (design tokens) |
| PostCSS | Minimal setup | Minimal setup |
| Content scanning | Via config | Via config (still needed) |

Anda sekarang sudah memiliki setup yang benar untuk Tailwind v4! 🎉
