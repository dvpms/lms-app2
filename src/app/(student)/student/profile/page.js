'use client'

import { useSession } from 'next-auth/react'
import { useSelector } from 'react-redux'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import Spinner from '@/components/ui/Spinner'

const LEVEL_MAX_POINTS = [100, 300, 600, 1000, Infinity]
const LEVEL_MIN_POINTS = [0, 100, 300, 600, 1000]

function getLevelProgress(points, level) {
  const min = LEVEL_MIN_POINTS[level - 1] ?? 0
  const max = LEVEL_MAX_POINTS[level - 1] ?? 1000
  if (max === Infinity) return 100
  return Math.round(((points - min) / (max - min)) * 100)
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const user = useSelector((state) => state.auth.user)

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner />
      </div>
    )
  }

  const displayUser = user ?? session?.user
  const points = displayUser?.points ?? 0
  const level = displayUser?.level ?? 1
  const progress = getLevelProgress(points, level)

  return (
    <div className="max-w-xl mx-auto px-6 py-8 flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-on-surface">Profil Saya</h1>

      <Card className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-full bg-primary flex items-center justify-center text-on-primary text-2xl font-bold">
            {displayUser?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="text-xl font-bold text-on-surface">{displayUser?.name}</p>
            <p className="text-sm text-on-surface-variant">{displayUser?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-primary">{points}</p>
            <p className="text-sm text-on-surface-variant">Total Poin</p>
          </div>
          <div className="bg-surface-container rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-secondary">Lv.{level}</p>
            <p className="text-sm text-on-surface-variant">Level</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Progress Level {level}</span>
            <span className="font-semibold text-on-surface">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      </Card>
    </div>
  )
}
