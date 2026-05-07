'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
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

    const sessionRes = await fetch('/api/auth/session')
    const session = await sessionRes.json()
    const role = session?.user?.role

    if (role === 'ADMIN') router.push('/admin/dashboard')
    else router.push('/student/dashboard')
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary">CeriaEdu</h1>
        <p className="text-on-surface-variant mt-2 text-sm">Platform belajar yang menyenangkan</p>
      </div>
      <Card>
        <h2 className="text-xl font-semibold text-on-surface mb-6">Masuk ke akun kamu</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
          {error && <p className="text-sm text-error">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? 'Memuat...' : 'Masuk'}
          </Button>
        </form>
        <p className="mt-6 text-sm text-on-surface-variant text-center">
          Belum punya akun?{' '}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Daftar
          </Link>
        </p>
      </Card>
    </div>
  )
}
