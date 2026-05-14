'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { Plus, Star, UserRound } from 'lucide-react'

const testimonials = [
  {
    id: 'budi',
    name: 'Budi Santoso',
    tag: '8 tahun',
    tagVariant: 'primary',
    accent: 'bg-primary',
    rating: 5,
    quote: 'Website ini sangat bagus untuk belajar! Aku jadi suka matematika.',
  },
  {
    id: 'ani',
    name: 'Ibu Ani',
    tag: 'Orang Tua',
    tagVariant: 'default',
    accent: 'bg-tertiary',
    rating: 4,
    quote: 'Mantapp... anak saya suka sekali! Belajarnya jadi tidak membosankan.',
  },
  {
    id: 'sari',
    name: 'Sari',
    tag: '9 tahun',
    tagVariant: 'secondary',
    accent: 'bg-secondary',
    rating: 5,
    quote: 'Kuisnya seru banget, aku bisa dapet ranking 1!',
  },
]

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
              className="self-start shrink-0 inline-flex items-center gap-2 rounded-full bg-surface-container px-4 py-2 text-on-surface-variant font-semibold ring-1 ring-outline-variant sm:self-auto"
              aria-label="Tambah testimoni"
            >
              <Plus className="size-4" aria-hidden="true" />
              Testimoni
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            {testimonials.map((t) => (
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
                    <UserRound className="size-7 text-on-surface-variant" />
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
      </div>
    </div>
  )
}
