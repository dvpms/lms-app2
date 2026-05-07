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
    <div className="flex items-center justify-between gap-4 mt-4">
      <Button
        variant="ghost"
        onClick={() => prevMaterial && router.push(`/student/materials/${prevMaterial.id}`)}
        disabled={!prevMaterial}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="size-4" />
        Sebelumnya
      </Button>

      <span className="text-sm text-on-surface-variant">
        {currentIndex + 1} / {materials.length}
      </span>

      <Button
        variant="primary"
        onClick={() => nextMaterial && router.push(`/student/materials/${nextMaterial.id}`)}
        disabled={!nextMaterial}
        className="flex items-center gap-2"
      >
        Selanjutnya
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}
