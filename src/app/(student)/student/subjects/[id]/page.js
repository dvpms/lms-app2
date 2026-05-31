'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useGetSubjectQuery } from '@/lib/redux/api/subjectsApi'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import { ArrowLeft, ArrowRight, Copyright } from 'lucide-react'

export default function SubjectDetailPage() {
  const { id } = useParams()
  const { data, isLoading, isError } = useGetSubjectQuery(id)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner />
      </div>
    )
  }

  if (isError) {
    return <p className="text-error text-center p-6">Gagal memuat subject.</p>
  }

  const subject = data?.data
  const materials = subject?.materials ?? []

  const subjectDescription = subject?.activitiesDescription

  return (
    <main className="flex-1 overflow-y-auto no-scrollbar px-6 pt-6 pb-24 relative bg-background">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/student/subjects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors mb-4"
          aria-label="Kembali ke daftar mata pelajaran"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Kembali
        </Link>

        <header className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-on-surface">
            {subject?.title}
          </h1>
          {subjectDescription && (
            <p className="mt-2 text-sm text-on-surface-variant leading-relaxed font-medium">
              {subjectDescription}
            </p>
          )}
        </header>

        <div>
          {materials.map((material) => {
            const description =
              subjectDescription ||
              'Materi ini berisi rangkuman, latihan, dan kuis singkat untuk membantu kamu belajar.'

            return (
              <Link key={material.id} href={`/student/materials/${material.id}`} className="block">
                <Card className="group p-4 mb-6 ring-1 ring-outline-variant cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-start mb-2 gap-3">
                    <h2 className="text-lg font-extrabold text-on-surface flex items-center gap-2">
                      {material.title}
                    </h2>
                  </div>

                  <p className="text-sm text-on-surface-variant leading-relaxed font-medium mb-4">
                    {description}
                  </p>

                  <div className="flex justify-end border-t border-outline-variant pt-3">
                    <span
                      className="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all"
                      aria-label="Lihat Materi"
                    >
                      Lihat Materi
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </span>
                  </div>
                </Card>
              </Link>
            )
          })}

          {materials.length === 0 && (
            <p className="text-on-surface-variant text-center py-8">Belum ada materi.</p>
          )}
        </div>

        <div className="text-center pb-8 opacity-60">
          <div className="flex items-center justify-center gap-2 text-on-surface-variant font-semibold text-xs">
            <Copyright className="size-4" aria-hidden="true" />
            <span>2025 CeriaEdu</span>
          </div>
        </div>
      </div>
    </main>
  )
}
