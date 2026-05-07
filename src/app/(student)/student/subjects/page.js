'use client'

import Link from 'next/link'
import { useGetSubjectsQuery } from '@/lib/redux/api/subjectsApi'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'

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
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-on-surface mb-6">Mata Pelajaran</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {subjects.map((subject) => (
          <Link key={subject.id} href={`/student/subjects/${subject.id}`}>
            <Card className="hover:shadow-[0_6px_16px_rgba(0,93,167,0.14)] transition-shadow cursor-pointer">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-on-surface">{subject.title}</h2>
                  {subject.activitiesDescription && (
                    <p className="text-sm text-on-surface-variant mt-1">
                      {subject.activitiesDescription}
                    </p>
                  )}
                </div>
                <Badge>{subject.materials?.length ?? 0} Materi</Badge>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
