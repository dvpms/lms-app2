'use client'

import { useSelector } from 'react-redux'
import { useGetLeaderboardQuery } from '@/lib/redux/api/leaderboardApi'
import LeaderboardTable from '@/components/features/leaderboard/LeaderboardTable'
import Spinner from '@/components/ui/Spinner'
import Card from '@/components/ui/Card'

const TOP_N = 10

export default function LeaderboardPage() {
  const { data, isLoading, isError } = useGetLeaderboardQuery()
  const reduxUser = useSelector((state) => state.auth.user)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner />
      </div>
    )
  }

  if (isError) {
    return <p className="text-error text-center p-6">Gagal memuat leaderboard.</p>
  }

  const leaderboard = data?.data?.leaderboard ?? []
  // Prefer API-provided currentUser (always accurate), fallback to Redux id for highlight
  const currentUser = data?.data?.currentUser ?? null
  const currentUserId = currentUser?.id ?? reduxUser?.id ?? null

  const topEntries = leaderboard.slice(0, TOP_N)
  const isCurrentUserInTop = topEntries.some((e) => e.id === currentUserId)
  const showCurrentUserCard = currentUser && !isCurrentUserInTop

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-on-surface">🏆 Leaderboard</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Top {TOP_N} siswa dengan poin terbanyak
        </p>
      </div>

      <LeaderboardTable entries={topEntries} currentUserId={currentUserId} />

      {showCurrentUserCard && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-on-surface-variant text-center">— Posisi kamu —</p>
          <LeaderboardTable entries={[currentUser]} currentUserId={currentUserId} />
        </div>
      )}

      {leaderboard.length === 0 && (
        <Card>
          <p className="text-on-surface-variant text-center py-8">
            Belum ada data leaderboard.
          </p>
        </Card>
      )}
    </div>
  )
}
