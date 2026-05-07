'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Registrasi gagal')
      return
    }

    router.push('/login')
  }

  return (
    <Card className="w-full max-w-md">
      <h1 className="text-2xl font-bold text-on-surface mb-6">Daftar ke CeriaEdu</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Nama"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
          autoComplete="name"
        />
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
          autoComplete="new-password"
          minLength={6}
        />
        {error && <p className="text-sm text-error">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full mt-2">
          {loading ? 'Memuat...' : 'Daftar'}
        </Button>
      </form>
      <p className="mt-4 text-sm text-on-surface-variant text-center">
        Sudah punya akun?{' '}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          Masuk
        </Link>
      </p>
    </Card>
  )
}
