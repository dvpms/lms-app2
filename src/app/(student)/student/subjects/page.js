'use client'

import Link from 'next/link'
import { useGetSubjectsQuery } from '@/lib/redux/api/subjectsApi'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import ProgressBar from '@/components/ui/ProgressBar'
import { BookOpen, Star } from 'lucide-react'

export default function SubjectsPage() {
  const { data, isLoading, isError } = useGetSubjectsQuery()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner />
      </div>
    )
  }

  if (isError) {
    return <p className="text-error text-center p-6">Gagal memuat subjects.</p>
  }

  const subjects = data?.data ?? []

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-28">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 gap-4">
          {subjects.map((subject) => {
            const materialsCount = subject.materials?.length ?? 0
            const title = subject.activitiesDescription || `Belajar ${subject.title}`
            const iconUrl = typeof subject.icon === 'string' && subject.icon.startsWith('http')
              ? subject.icon
              : null

            const progress =
              typeof subject.progress === 'number' && Number.isFinite(subject.progress)
                ? subject.progress
                : null

            const showStar = materialsCount >= 3

            return (
              <Link
                key={subject.id}
                href={`/student/subjects/${subject.id}`}
                className="group"
              >
                <Card className="flex flex-col gap-3 p-3 ring-1 ring-outline-variant transition-all duration-300 hover:shadow-md">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container-low">
                    {iconUrl ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${iconUrl})` }}
                        aria-label={`Gambar untuk ${subject.title}`}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-extrabold text-on-surface-variant" aria-hidden="true">
                          {subject.title?.trim?.()?.charAt?.(0)?.toUpperCase?.() || 'S'}
                        </span>
                      </div>
                    )}

                    {showStar && (
                      <div className="absolute top-2 right-2 rounded-full p-1 shadow-sm bg-surface-container-lowest/90 backdrop-blur-sm">
                        <Star
                          className="size-4 text-tertiary-fixed-dim fill-tertiary-fixed-dim"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-fixed px-2 py-0.5 rounded-md">
                        {subject.title}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-on-surface line-clamp-2 leading-tight">
                      {title}
                    </h3>

                    {progress !== null ? (
                      <div className="mt-1">
                        <div className="flex justify-between text-[10px] text-on-surface-variant mb-1 font-medium">
                          <span>Progress</span>
                          <span className="text-primary">{Math.round(progress)}%</span>
                        </div>
                        <ProgressBar value={progress} className="h-1.5" />
                      </div>
                    ) : (
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-on-surface-variant font-medium">
                        <BookOpen className="size-4" aria-hidden="true" />
                        <span>{materialsCount} Materi</span>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
