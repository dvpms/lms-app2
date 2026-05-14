'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function MaterialNav({ materials, currentMaterialId }) {
  const router = useRouter()

  const currentIndex = materials.findIndex((m) => m.id === currentMaterialId)
  const prevMaterial = currentIndex > 0 ? materials[currentIndex - 1] : null
  const nextMaterial = currentIndex < materials.length - 1 ? materials[currentIndex + 1] : null

  return (
    <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <Button
        variant="ghost"
        onClick={() => prevMaterial && router.push(`/student/materials/${prevMaterial.id}`)}
        disabled={!prevMaterial}
        size="sm"
        className="flex items-center justify-center gap-2 w-full sm:w-auto"
      >
        <ChevronLeft className="size-4" />
        Sebelumnya
      </Button>

      <span className="text-xs sm:text-sm text-on-surface-variant text-center">
        {currentIndex + 1} / {materials.length}
      </span>

      <Button
        variant="primary"
        onClick={() => nextMaterial && router.push(`/student/materials/${nextMaterial.id}`)}
        disabled={!nextMaterial}
        size="sm"
        className="flex items-center justify-center gap-2 w-full sm:w-auto"
      >
        Selanjutnya
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}
