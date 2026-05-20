'use client'

import { useEffect, useState } from 'react'
import { Pencil, Star, Trophy, BookOpen } from 'lucide-react'
import ProgressBar from '@/components/ui/ProgressBar'
import Spinner from '@/components/ui/Spinner'

const LEVEL_LABELS = ['', 'Pemula', 'Pelajar', 'Mahir', 'Ahli', 'Master']
const LEVEL_MIN_POINTS = [0, 0, 100, 300, 600, 1000]
const LEVEL_MAX_POINTS = [0, 100, 300, 600, 1000, Infinity]

function getLevelProgress(points, level) {
  const min = LEVEL_MIN_POINTS[level] ?? 0
  const max = LEVEL_MAX_POINTS[level] ?? 1000
  if (max === Infinity) return 100
  return Math.min(100, Math.round(((points - min) / (max - min)) * 100))
}

function InfoField({ label, value, muted = false }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-on-surface-variant">{label}</label>
      <div
        className={`bg-surface-container-low px-4 py-3 rounded-xl border border-outline-variant/50 text-base min-h-12 flex items-center ${
          muted ? 'text-on-surface-variant' : 'text-on-surface'
        }`}
      >
        {value || '—'}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch('/api/me')
        if (!res.ok) return
        const json = await res.json()
        setUserData(json.data)
      } catch {
        // silently fail — show empty state
      } finally {
        setIsLoading(false)
      }
    }
    fetchMe()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner />
      </div>
    )
  }
  const name = userData?.name ?? 'Student'
  const email = userData?.email ?? ''
  const points = userData?.points ?? 0
  const level = userData?.level ?? 1
  const initial = name.trim().charAt(0).toUpperCase()
  const progress = getLevelProgress(points, level)
  const levelLabel = LEVEL_LABELS[level] ?? `Level ${level}`
  const nextLevelPoints = LEVEL_MAX_POINTS[level]

  return (
    <div className="flex-1 overflow-y-auto pb-28">
      <div className="flex flex-col items-center w-full px-6 pt-6 gap-6 max-w-2xl mx-auto">

        {/* Top Section: Avatar + Name + Edit button */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 relative">
          <div className="flex flex-col items-center md:items-start gap-3 w-full md:w-auto">
            {/* Avatar */}
            <div className="relative size-28 rounded-full overflow-hidden border-4 border-surface-container-lowest shadow-[0_6px_16px_rgba(0,93,167,0.14)] bg-primary-fixed flex items-center justify-center">
              <span className="text-5xl font-extrabold text-primary">{initial}</span>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-on-surface">{name}</h2>
              <p className="text-sm text-on-surface-variant">{levelLabel}</p>
            </div>
          </div>

          {/* Edit button — placeholder, no edit form yet */}
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-secondary-container text-on-secondary-container font-semibold text-sm shadow-[0_4px_12px_rgba(0,93,167,0.08)] opacity-50 w-full md:w-auto justify-center md:absolute md:top-0 md:right-0"
          >
            <Pencil size={16} />
            Edit Profil
          </button>
        </div>

        {/* Stats Section */}
        <div className="w-full bg-surface-container-lowest rounded-2xl shadow-[0_4px_12px_rgba(0,93,167,0.08)] border border-outline-variant/30 p-5">
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="flex flex-col items-center justify-center p-4 bg-surface-container rounded-xl text-center">
              <Star size={20} className="text-primary mb-1" />
              <span className="text-2xl font-bold text-primary">{points.toLocaleString()}</span>
              <span className="text-xs text-on-surface-variant mt-0.5">Total Poin</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-surface-container rounded-xl text-center">
              <Trophy size={20} className="text-secondary mb-1" />
              <span className="text-2xl font-bold text-secondary">Lv.{level}</span>
              <span className="text-xs text-on-surface-variant mt-0.5">{levelLabel}</span>
            </div>
          </div>

          {/* Level progress */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-medium text-on-surface-variant">
              <span>Progress Level {level}</span>
              {nextLevelPoints !== Infinity ? (
                <span>{points} / {nextLevelPoints} poin</span>
              ) : (
                <span>Level Maksimal 🎉</span>
              )}
            </div>
            <ProgressBar value={progress} />
          </div>
        </div>

        {/* Detail Info Card */}
        <div className="w-full bg-surface-container-lowest rounded-2xl shadow-[0_4px_12px_rgba(0,93,167,0.08)] border border-outline-variant/30 p-5 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-on-surface border-b border-outline-variant/30 pb-3">
            Detail Informasi
          </h3>

          <InfoField label="Nama Lengkap" value={name} />
          <InfoField label="Email" value={email} muted />
          <InfoField label="Level" value={`${levelLabel} (Level ${level})`} />
        </div>

        {/* Activity summary */}
        <div className="w-full bg-surface-container-lowest rounded-2xl shadow-[0_4px_12px_rgba(0,93,167,0.08)] border border-outline-variant/30 p-5 flex flex-col gap-3">
          <h3 className="text-lg font-bold text-on-surface border-b border-outline-variant/30 pb-3">
            Aktivitas
          </h3>
          <div className="flex items-center gap-3 text-sm text-on-surface-variant">
            <BookOpen size={18} className="text-primary shrink-0" />
            <span>Terus belajar untuk naik level dan panjat leaderboard!</span>
          </div>
        </div>

      </div>
    </div>
  )
}
