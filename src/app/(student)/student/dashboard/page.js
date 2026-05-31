'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { Plus, Star, UserRound } from 'lucide-react'

function Stars({ value }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${value} dari 5 bintang`}>
      {Array.from({ length: 5 }).map((_, idx) => {
        const filled = idx + 1 <= value
        return (
          <Star
            key={idx}
            className={
              filled
                ? 'size-4 text-tertiary-fixed-dim fill-tertiary-fixed-dim'
                : 'size-4 text-outline-variant'
            }
            aria-hidden="true"
          />
        )
      })}
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { status, data: session } = useSession()
  const [userTestimonials, setUserTestimonials] = useState([])
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [quote, setQuote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch('/api/testimonials')
        const json = await res.json()
        if (res.ok) {
          setUserTestimonials(json.data ?? [])
        }
      } catch {
        // keep featured testimonials visible even if the request fails
      } finally {
        setIsLoadingTestimonials(false)
      }
    }

    fetchTestimonials()
  }, [])

  const testimonials = useMemo(() => {
    return userTestimonials.map((item) => ({
      id: item.id,
      name: item.user?.name ?? 'Pengguna',
      tag: item.user?.role === 'TEACHER' ? 'Guru' : 'User',
      tagVariant: 'primary',
      accent: 'bg-secondary',
      rating: item.rating,
      quote: item.quote,
      avatar: item.user?.avatar ?? null,
    }))
  }, [userTestimonials])

  async function handleSubmitTestimonial() {
    if (status !== 'authenticated') {
      router.push('/login')
      return
    }

    setError('')
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, quote }),
      })

      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Gagal menyimpan testimonial')
        return
      }

      const saved = json.data
      setUserTestimonials((prev) => {
        const next = prev.filter((item) => item.id !== saved.id)
        return [saved, ...next]
      })
      setQuote('')
      setRating(5)
      setIsModalOpen(false)
    } catch {
      setError('Gagal menyimpan testimonial')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col gap-6">
        {/* Hero */}
        <Card className="bg-primary-fixed">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1 justify-center md:justify-start text-center sm:text-left">
              <h1 className="text-2xl font-extrabold leading-tight text-on-primary-fixed">
                Belajar Jadi Seru
                <br />
                <span className="text-primary">dan Menyenangkan!</span>
              </h1>
              <p className="mt-2 text-on-surface-variant">
                Ayo mulai petualangan belajarmu hari ini.
              </p>

              <div className="mt-5 ">
                <Link
                  href="/student/subjects"
                  aria-label="Mulai Belajar"
                  className="inline-flex items-center justify-center min-h-12 px-6 rounded-xl bg-secondary-container text-on-secondary-container font-semibold shadow-[0_4px_12px_rgba(0,93,167,0.08)] hover:shadow-[0_6px_16px_rgba(0,93,167,0.14)] active:scale-[0.98]"
                >
                  MULAI BELAJAR
                </Link>
              </div>
            </div>

            {/* Illustration placeholder (no public assets in repo) */}
            <div className="shrink-0 self-center w-28 h-28 rounded-xl bg-surface-container-lowest ring-1 ring-outline-variant flex items-center justify-center sm:self-auto">
              <UserRound className="size-12 text-on-surface-variant" aria-hidden="true" />
            </div>
          </div>
        </Card>

        {/* Testimonials */}
        <section>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">
              APA KATA MEREKA?
            </h2>
            <button
              type="button"
              onClick={() => {
                if (status !== 'authenticated') {
                  router.push('/login')
                  return
                }
                setIsModalOpen(true)
              }}
              className="self-start shrink-0 inline-flex items-center gap-2 rounded-full bg-surface-container px-4 py-2 text-on-surface-variant font-semibold ring-1 ring-outline-variant sm:self-auto"
              aria-label="Tambah testimoni"
            >
              <Plus className="size-4" aria-hidden="true" />
              Testimoni
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            {isLoadingTestimonials ? (
              <Card className="p-5 text-on-surface-variant">Memuat testimonial...</Card>
            ) : testimonials.length === 0 ? (
              <Card className="p-5 text-on-surface-variant">
                Belum ada testimonial. Jadilah yang pertama berbagi pengalaman belajar.
              </Card>
            ) : testimonials.map((t) => (
              <Card key={t.id} className="relative overflow-hidden rounded-xl p-5">
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${t.accent}`}
                  aria-hidden="true"
                />

                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 h-14 w-14 rounded-full bg-surface-container-low ring-2 ring-outline-variant flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.name} className="h-full w-full rounded-full object-cover" />
                    ) : (
                      <UserRound className="size-7 text-on-surface-variant" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-extrabold text-on-surface truncate">{t.name}</p>
                      <Badge variant={t.tagVariant} className="text-sm">
                        {t.tag}
                      </Badge>
                    </div>

                    <p className="mt-2 text-on-surface-variant">“{t.quote}”</p>
                    <div className="mt-3">
                      <Stars value={t.rating} />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="md">
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-lg font-bold text-on-surface">Tambah Testimonial</h3>
              <p className="text-sm text-on-surface-variant mt-1">
                Bagikan pengalaman belajarmu. Testimonial akan langsung tampil di dashboard.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-surface-container-low p-3">
              <div className="size-12 rounded-full bg-surface-container flex items-center justify-center overflow-hidden">
                {session?.user?.name ? (
                  <span className="font-bold text-primary">
                    {session.user.name.trim().charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <UserRound className="size-6 text-on-surface-variant" />
                )}
              </div>
              <div>
                <p className="font-semibold text-on-surface">{session?.user?.name ?? 'Pengguna'}</p>
                <p className="text-xs text-on-surface-variant">Tampil langsung setelah disimpan</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-on-surface-variant">Rating</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const value = idx + 1
                  const filled = value <= rating
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className="p-1"
                      aria-label={`${value} bintang`}
                    >
                      <Star
                        className={`size-6 transition-colors ${filled ? 'text-tertiary-fixed-dim fill-tertiary-fixed-dim' : 'text-outline-variant'}`}
                      />
                    </button>
                  )
                })}
              </div>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-on-surface-variant">Testimonial</span>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                rows={4}
                placeholder="Tulis pengalaman belajarmu di sini..."
                className="w-full rounded-xl border-2 border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface focus:border-primary focus:outline-none"
              />
            </label>

            {error && <p className="text-sm text-error">{error}</p>}

            <div className="flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleSubmitTestimonial} disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Kirim Testimoni'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
