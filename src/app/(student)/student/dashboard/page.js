'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useSelector } from 'react-redux'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import { BookOpen, Gamepad2, Trophy } from 'lucide-react'

const LEVEL_MIN_POINTS = [0, 100, 300, 600, 1000]
const LEVEL_MAX_POINTS = [100, 300, 600, 1000, Infinity]

function getLevelProgress(points, level) {
  const min = LEVEL_MIN_POINTS[level - 1] ?? 0
  const max = LEVEL_MAX_POINTS[level - 1] ?? 1000
  if (max === Infinity) return 100
  return Math.round(((points - min) / (max - min)) * 100)
}

const shortcuts = [
  { href: '/student/subjects', label: 'Materi', icon: BookOpen, color: 'bg-primary-fixed text-primary' },
  { href: '/student/games/word-arrangement', label: 'Susun Kata', icon: Gamepad2, color: 'bg-secondary-container text-on-secondary-container' },
  { href: '/student/games/word-puzzle', label: 'Teka-Teki', icon: Gamepad2, color: 'bg-tertiary-fixed text-on-tertiary-fixed' },
  { href: '/student/games/multiplication-puzzle', label: 'Puzzle Perkalian', icon: Gamepad2, color: 'bg-surface-container text-on-surface' },
  { href: '/student/leaderboard', label: 'Leaderboard', icon: Trophy, color: 'bg-error-container text-on-error-container' },
]

export default function DashboardPage() {
  const { data: session } = useSession()
  const user = useSelector((state) => state.auth.user)

  const displayUser = user ?? session?.user
  const points = displayUser?.points ?? 0
  const level = displayUser?.level ?? 1
  const progress = getLevelProgress(points, level)

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-on-surface">
          Halo, {displayUser?.name?.split(' ')[0] ?? 'Siswa'}! 👋
        </h1>
        <p className="text-on-surface-variant mt-1">Semangat belajar hari ini!</p>
      </div>

      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-on-surface-variant">Total Poin</p>
            <p className="text-4xl font-bold text-primary">{points}</p>
          </div>
          <Badge variant="secondary">Level {level}</Badge>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Progress ke Level {level + 1}</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      </Card>

      <div>
        <h2 className="text-xl font-bold text-on-surface mb-4">Mulai Belajar</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {shortcuts.map(({ href, label, icon: Icon, color }) => (
            <Link key={href} href={href}>
              <Card className={`flex flex-col items-center gap-3 text-center cursor-pointer hover:shadow-[0_6px_16px_rgba(0,93,167,0.14)] transition-shadow ${color}`}>
                <Icon className="size-8" />
                <span className="font-semibold text-sm">{label}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
