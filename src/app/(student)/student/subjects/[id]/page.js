'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useGetSubjectQuery } from '@/lib/redux/api/subjectsApi'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'

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

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-on-surface mb-2">{subject?.title}</h1>
      {subject?.activitiesDescription && (
        <p className="text-on-surface-variant mb-6">{subject.activitiesDescription}</p>
      )}
      <div className="flex flex-col gap-3">
        {materials.map((material, index) => (
          <Link key={material.id} href={`/student/materials/${material.id}`}>
            <Card className="hover:shadow-[0_6px_16px_rgba(0,93,167,0.14)] transition-shadow cursor-pointer">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{index + 1}</Badge>
                  <span className="font-semibold text-on-surface">{material.title}</span>
                </div>
                <span className="text-sm text-on-surface-variant">Buka →</span>
              </div>
            </Card>
          </Link>
        ))}
        {materials.length === 0 && (
          <p className="text-on-surface-variant text-center py-8">Belum ada materi.</p>
        )}
      </div>
    </div>
  )
}
