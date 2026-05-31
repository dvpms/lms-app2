'use client'

import { useEffect, useMemo, useState } from 'react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import { MessageCircle, Star, UserRound, Clock3 } from 'lucide-react'

function Stars({ value }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${value} dari 5 bintang`}>
      {Array.from({ length: 5 }).map((_, idx) => {
        const filled = idx + 1 <= value
        return (
          <Star
            key={idx}
            className={filled ? 'size-4 text-tertiary-fixed-dim fill-tertiary-fixed-dim' : 'size-4 text-outline-variant'}
            aria-hidden="true"
          />
        )
      })}
    </div>
  )
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch('/api/testimonials')
        const json = await res.json()
        if (!res.ok) {
          setIsError(true)
          return
        }
        setTestimonials(json.data ?? [])
      } catch {
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  const stats = useMemo(() => {
    const total = testimonials.length
    const average = total > 0 ? (testimonials.reduce((sum, item) => sum + item.rating, 0) / total).toFixed(1) : '0.0'
    return { total, average }
  }, [testimonials])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner />
      </div>
    )
  }

  if (isError) {
    return <p className="text-error text-center p-6">Gagal memuat testimonial.</p>
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <MessageCircle className="size-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-on-surface">Testimonial</h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Lihat semua testimonial dari user. Halaman ini read-only.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Badge variant="primary">Total {stats.total}</Badge>
          <Badge variant="secondary">Rata-rata {stats.average} / 5</Badge>
        </div>
      </div>

      {testimonials.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-on-surface-variant">
            <MessageCircle size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-semibold">Belum ada testimonial</p>
            <p className="text-sm mt-1">Testimonial user akan muncul di sini.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {testimonials.map((item) => {
            const user = item.user ?? {}
            return (
              <Card key={item.id} className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="size-14 rounded-full bg-surface-container-low ring-2 ring-outline-variant flex items-center justify-center shrink-0 overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name ?? 'User'} className="h-full w-full object-cover" />
                    ) : (
                      <UserRound className="size-7 text-on-surface-variant" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <p className="font-semibold text-on-surface truncate">{user.name ?? 'Pengguna'}</p>
                        <p className="text-xs text-on-surface-variant">{user.role ?? 'STUDENT'}</p>
                      </div>
                      <Badge variant="default">ID: {item.id.slice(0, 8)}</Badge>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">Rating {item.rating}/5</Badge>
                      <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                        <Clock3 className="size-3.5" />
                        {formatDate(item.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Stars value={item.rating} />
                  <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                    “{item.quote}”
                  </p>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}