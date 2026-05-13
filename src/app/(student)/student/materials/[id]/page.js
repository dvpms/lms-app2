'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useGetMaterialQuery } from '@/lib/redux/api/materialsApi'
import MaterialViewer from '@/components/features/material/MaterialViewer'
import Spinner from '@/components/ui/Spinner'
import { ArrowLeft } from 'lucide-react'

export default function MaterialPage() {
  const { id } = useParams()
  const { data: materialData, isLoading } = useGetMaterialQuery(id)
  const material = materialData?.data

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner />
      </div>
    )
  }

  if (!material) {
    return <p className="text-error text-center p-6">Materi tidak ditemukan.</p>
  }

  const cards = Array.isArray(material.cards) ? material.cards : []

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <Link
        href={material.subjectId ? `/student/subjects/${material.subjectId}` : '/student/subjects'}
        className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors mb-4"
        aria-label="Kembali"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Kembali
      </Link>

      <h1 className="text-2xl font-bold text-on-surface mb-6">{material.title}</h1>
      <MaterialViewer cards={cards} />
    </div>
  )
}
