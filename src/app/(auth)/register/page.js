'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Swal from 'sweetalert2'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [roleChoice, setRoleChoice] = useState('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("");

    // Lazy import sweetalert2

    if (form.password !== form.confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok');
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Konfirmasi kata sandi tidak cocok',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: roleChoice === 'teacher' ? 'TEACHER' : 'STUDENT',
        }),
      });

      setLoading(false);

      if (!res.ok) {
        let msg = 'Registrasi gagal';
        try {
          const data = await res.json();
          msg = data.error || msg;
        } catch {}
        setError(msg);
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: msg,
        });
        return;
      }

      await Swal.fire({
        icon: 'success',
        title: 'Registrasi Berhasil',
        text: 'Akun berhasil dibuat. Silakan login.',
        confirmButtonText: 'OK',
      });
      router.push('/login');
    } catch (err) {
      setLoading(false);
      setError('Terjadi kesalahan jaringan');
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Terjadi kesalahan jaringan',
      });
    }
  }

  return (
    <div className="w-full min-h-dvh antialiased flex items-center justify-center p-4">
      <Card className="relative w-full max-w-md rounded-3xl overflow-hidden p-0 border border-outline-variant">
        <header className="flex items-center justify-center px-6 pt-6 pb-2">
          <div className="flex-1 text-center" />
        </header>

        <main className="px-6 pb-8 pt-2">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-on-surface mb-2">Buat Akun Baru</h2>
            <p className="text-on-surface-variant text-sm">Lengkapi data diri untuk memulai belajar</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-on-surface ml-1" htmlFor="fullname">
                Nama Lengkap
              </label>
              <Input
                id="fullname"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
                placeholder="Masukkan nama lengkap"
                className="rounded-2xl"
                startIcon={<UserRound className="h-5 w-5" aria-hidden="true" />}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-on-surface ml-1" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="contoh@email.com"
                className="rounded-2xl"
                startIcon={<Mail className="h-5 w-5" aria-hidden="true" />}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-on-surface ml-1" htmlFor="role">
                Peran
              </label>
              <div className="relative group">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant transition-colors group-focus-within:text-primary">
                  <BadgeCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <select
                  id="role"
                  name="role"
                  value={roleChoice}
                  onChange={(e) => setRoleChoice(e.target.value)}
                  className="block w-full min-h-12 appearance-none rounded-2xl bg-surface-container-low py-3 pl-10 pr-10 text-on-surface outline-none ring-1 ring-outline-variant transition-all focus:ring-2 focus:ring-primary"
                >
                  <option value="student">Murid</option>
                  <option value="teacher">Guru</option>
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-on-surface-variant transition-colors group-focus-within:text-primary">
                  <ChevronDown className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-on-surface ml-1" htmlFor="password">
                Kata Sandi
              </label>
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                minLength={8}
                placeholder="Minimal 8 karakter"
                className="rounded-2xl"
                startIcon={<LockKeyhole className="h-5 w-5" aria-hidden="true" />}
                endElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="h-12 w-12 -mr-3 flex items-center justify-center text-on-surface-variant hover:text-on-surface"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-on-surface ml-1" htmlFor="confirm-password">
                Konfirmasi Kata Sandi
              </label>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                minLength={8}
                placeholder="Ulangi kata sandi"
                className="rounded-2xl"
                startIcon={<ShieldCheck className="h-5 w-5" aria-hidden="true" />}
                endElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="h-12 w-12 -mr-3 flex items-center justify-center text-on-surface-variant hover:text-on-surface"
                    aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi kata sandi' : 'Tampilkan konfirmasi kata sandi'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                }
              />
            </div>

            {error && <p className="text-sm text-error">{error}</p>}

            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                variant="success"
                size="lg"
                className="w-full rounded-full min-h-14 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Mengirim...' : 'Daftar'}</span>
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>

            <div className="text-center -mt-1 pb-2">
              <p className="text-on-surface-variant text-sm">
                Sudah punya akun?{' '}
                <Link
                  href="/login"
                  className="text-on-surface font-bold hover:underline decoration-primary decoration-2 underline-offset-4"
                >
                  Masuk
                </Link>
              </p>
            </div>
          </form>
        </main>
      </Card>
    </div>
  )
}
