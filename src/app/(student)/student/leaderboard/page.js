'use client'

import { useSelector } from 'react-redux'
import { useGetLeaderboardQuery } from '@/lib/redux/api/leaderboardApi'
import LeaderboardTable from '@/components/features/leaderboard/LeaderboardTable'
import Spinner from '@/components/ui/Spinner'

export default function LeaderboardPage() {
  const { data, isLoading, isError } = useGetLeaderboardQuery()
  const user = useSelector((state) => state.auth.user)

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

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-on-surface mb-6">🏆 Leaderboard</h1>
      <LeaderboardTable entries={leaderboard} currentUserId={user?.id} />
    </div>
  )
}
