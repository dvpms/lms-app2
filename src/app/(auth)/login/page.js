'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronDown, Lock, Mail, School, UserRound } from 'lucide-react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [roleChoice, setRoleChoice] = useState('student')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Email atau password salah')
      return
    }

    // Poll session until role is available (avoids race condition with cookie)
    let role = null
    for (let i = 0; i < 5; i++) {
      const sessionRes = await fetch('/api/auth/session')
      const session = await sessionRes.json()
      role = session?.user?.role
      if (role) break
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    if (role === 'ADMIN') router.push('/admin/dashboard')
    else if (role === 'TEACHER') router.push('/student/subjects')
    else router.push('/student/dashboard')
  }

  return (
    <div className="relative max-w-max overflow-hidden p-4">
      {/* Decorative background shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-surface-container-highest opacity-50 rounded-b-[50%] scale-150 -translate-y-20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 w-64 h-64 bg-tertiary-fixed opacity-20 rounded-full translate-x-1/3 translate-y-1/3"
      />

      <Card className="relative w-full rounded-2xl border border-outline-variant p-6 sm:p-8 shadow-[0_4px_12px_rgba(0,93,167,0.08)]">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="bg-primary-fixed p-4 rounded-full">
            <School className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-primary tracking-tight">CeriaEdu</h1>
            <p className="text-on-surface-variant text-sm font-medium">Belajar Jadi Seru dan Menyenangkan!</p>
          </div>
        </div>

        <h2 className="mt-6 text-xl font-semibold text-on-surface">Masuk ke akun kamu</h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-bold text-on-surface-variant ml-1">
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
              placeholder="nama@email.com"
              startIcon={<Mail className="h-5 w-5" aria-hidden="true" />}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="role" className="block text-sm font-bold text-on-surface-variant ml-1">
              Masuk Sebagai
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant">
                <UserRound className="h-5 w-5" aria-hidden="true" />
              </span>
              <select
                id="role"
                name="role"
                value={roleChoice}
                onChange={(e) => setRoleChoice(e.target.value)}
                className="block w-full min-h-12 appearance-none rounded-xl bg-surface-container-low py-3 pl-10 pr-10 text-on-surface outline-none ring-1 ring-outline-variant transition-all focus:ring-2 focus:ring-primary"
              >
                <option value="student">Murid</option>
                <option value="teacher">Guru</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-on-surface-variant">
                <ChevronDown className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-bold text-on-surface-variant ml-1">
              Kata Sandi
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              startIcon={<Lock className="h-5 w-5" aria-hidden="true" />}
            />
            <div className="flex justify-end">
              <a href="#" className="text-xs font-semibold text-primary hover:underline">
                Lupa Kata Sandi?
              </a>
            </div>
          </div>

          {error && <p className="text-sm text-error">{error}</p>}

          <div className="pt-1 space-y-4">
            <label className="flex items-center gap-2 text-sm text-on-surface-variant">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border border-outline-variant bg-surface-container-low text-primary focus:ring-primary"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Ingat Saya
            </label>

            <Button type="submit" disabled={loading} variant="success" size="lg" className="w-full">
              {loading ? 'Memuat...' : 'Login'}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-on-surface-variant">
            Belum Punya Akun?
            <Link href="/register" className="font-bold text-primary hover:underline">
             {" "} Daftar
            </Link>
          </p>
        </div>

        <div className="mt-4 flex items-center justify-center opacity-70">
          <p className="text-xs font-medium text-on-surface-variant">© 2026 CeriaEdu</p>
        </div>
      </Card>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-8 h-16 bg-secondary opacity-20 rounded-t-[50%]"
      />
    </div>
  )
}
