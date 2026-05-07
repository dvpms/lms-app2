'use client'

import { useParams } from 'next/navigation'
import { useGetMaterialQuery } from '@/lib/redux/api/materialsApi'
import { useGetMaterialsQuery } from '@/lib/redux/api/materialsApi'
import MaterialViewer from '@/components/features/material/MaterialViewer'
import MaterialNav from '@/components/features/material/MaterialNav'
import Spinner from '@/components/ui/Spinner'

export default function MaterialPage() {
  const { id } = useParams()
  const { data: materialData, isLoading } = useGetMaterialQuery(id)
  const material = materialData?.data

  const { data: materialsData } = useGetMaterialsQuery(
    material?.subjectId ? { subjectId: material.subjectId } : undefined,
    { skip: !material?.subjectId },
  )
  const materials = materialsData?.data ?? []

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
      <h1 className="text-2xl font-bold text-on-surface mb-6">{material.title}</h1>
      <MaterialViewer cards={cards} />
      {materials.length > 0 && (
        <MaterialNav materials={materials} currentMaterialId={id} />
      )}
    </div>
  )
}
