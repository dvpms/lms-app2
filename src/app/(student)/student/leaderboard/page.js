'use client'

import { useSelector } from 'react-redux'
import { useGetLeaderboardQuery } from '@/lib/redux/api/leaderboardApi'
import Spinner from '@/components/ui/Spinner'
import clsx from 'clsx'
import { Star } from 'lucide-react'

function getInitials(name) {
  return name?.trim()?.charAt(0)?.toUpperCase() ?? '?'
}

const podiumColors = {
  1: {
    bar: 'bg-gradient-to-b from-[#FFD700] to-[#FFA500]',
    border: 'border-[#FFD700]',
    avatar: 'border-[#FFD700]',
    text: 'text-white',
    badge: 'bg-yellow-100 text-yellow-700',
    shadow: 'shadow-[0_8px_24px_rgba(255,193,7,0.4)]',
    height: 'h-28',
  },
  2: {
    bar: 'bg-surface-container-high',
    border: 'border-outline-variant',
    avatar: 'border-outline-variant',
    text: 'text-on-surface-variant',
    badge: 'bg-surface-container text-on-surface-variant',
    shadow: 'shadow-md',
    height: 'h-20',
  },
  3: {
    bar: 'bg-gradient-to-b from-[#CD7F32] to-[#A0522D]',
    border: 'border-[#CD7F32]',
    avatar: 'border-[#CD7F32]',
    text: 'text-white',
    badge: 'bg-orange-100 text-orange-800',
    shadow: 'shadow-md',
    height: 'h-16',
  },
}

function PodiumSlot({ entry, rank, isCurrentUser }) {
  const style = podiumColors[rank]
  const isFirst = rank === 1

  return (
    <div className={clsx('flex flex-col items-center', isFirst ? 'order-2 z-10' : rank === 2 ? 'order-1' : 'order-3')}>
      {/* Avatar */}
      <div className="relative mb-2">
        {isFirst && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-2xl">👑</div>
        )}
        <div
          className={clsx(
            'rounded-full border-4 overflow-hidden flex items-center justify-center font-bold text-on-surface bg-surface-container',
            style.avatar,
            style.shadow,
            isFirst ? 'size-16' : 'size-12',
          )}
        >
          <span className={clsx('font-extrabold', isFirst ? 'text-xl' : 'text-base')}>
            {getInitials(entry.name)}
          </span>
        </div>
        {isCurrentUser && (
          <div className="absolute -top-2 -right-2 bg-primary text-on-primary text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
            Kamu
          </div>
        )}
      </div>

      {/* Name */}
      <p className={clsx('text-xs font-bold text-center truncate max-w-[72px] mb-1', isCurrentUser ? 'text-primary' : 'text-on-surface')}>
        {entry.name}
      </p>

      {/* Bar */}
      <div
        className={clsx(
          'w-20 md:w-24 rounded-t-2xl flex flex-col items-center justify-start pt-3 gap-1',
          style.bar,
          style.height,
        )}
      >
        <span className={clsx('text-2xl font-black opacity-60', style.text)}>{rank}</span>
        <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-full', style.badge)}>
          {entry.points} pts
        </span>
      </div>
    </div>
  )
}

function ListRow({ entry, isCurrentUser }) {
  return (
    <div
      className={clsx(
        'flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all',
        isCurrentUser
          ? 'border-primary bg-primary-fixed shadow-[0_4px_0_rgba(0,93,167,0.2)]'
          : 'border-transparent hover:border-outline-variant hover:bg-surface-container-low',
      )}
    >
      <span className={clsx('font-black text-base w-6 text-center shrink-0', isCurrentUser ? 'text-primary' : 'text-on-surface-variant')}>
        {entry.rank}
      </span>
      <div className="size-10 rounded-full bg-surface-container flex items-center justify-center shrink-0 border-2 border-outline-variant">
        <span className="text-sm font-bold text-on-surface-variant">{getInitials(entry.name)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className={clsx('font-semibold text-sm truncate', isCurrentUser ? 'text-primary' : 'text-on-surface')}>
          {entry.name}
          {isCurrentUser && <span className="ml-1.5 text-xs font-normal">(Kamu)</span>}
        </p>
        <p className="text-xs text-on-surface-variant">Level {entry.level}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <span className={clsx('font-bold text-sm', isCurrentUser ? 'text-primary' : 'text-on-surface-variant')}>
          {entry.points}
        </span>
        <Star size={14} className={isCurrentUser ? 'text-primary fill-primary' : 'text-outline-variant'} />
      </div>
    </div>
  )
}

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
  const currentUser = data?.data?.currentUser ?? null
  const currentUserId = currentUser?.id ?? reduxUser?.id ?? null

  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)
  const isCurrentUserInTop3 = top3.some((e) => e.id === currentUserId)
  const isCurrentUserInRest = rest.some((e) => e.id === currentUserId)
  const showCurrentUserSeparate = currentUser && !isCurrentUserInTop3 && !isCurrentUserInRest

  // Podium order: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean)

  return (
    <div className="flex-1 overflow-y-auto pb-28">
      <div className="max-w-2xl mx-auto flex flex-col items-center px-4 pt-6">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-on-surface-variant mb-1">Panggung Juara</p>
          <h1 className="text-3xl font-extrabold text-on-surface">Peringkat Siswa</h1>
        </div>

        {/* Podium */}
        {top3.length > 0 && (
          <div className="flex items-end justify-center gap-2 mb-10 w-full max-w-xs">
            {podiumOrder.map((entry) => (
              <PodiumSlot
                key={entry.id}
                entry={entry}
                rank={entry.rank}
                isCurrentUser={entry.id === currentUserId}
              />
            ))}
          </div>
        )}

        {/* List */}
        {(rest.length > 0 || showCurrentUserSeparate) && (
          <div className="w-full bg-surface-container-lowest rounded-3xl shadow-[0_4px_12px_rgba(0,93,167,0.08)] border border-outline-variant p-5 md:p-6">
            <h3 className="text-lg font-extrabold text-on-surface mb-4">Peringkat Lainnya</h3>

            <div className="flex flex-col gap-1">
              {rest.map((entry) => (
                <ListRow
                  key={entry.id}
                  entry={entry}
                  isCurrentUser={entry.id === currentUserId}
                />
              ))}

              {showCurrentUserSeparate && (
                <>
                  <div className="flex items-center gap-2 my-2">
                    <div className="flex-1 h-px bg-outline-variant" />
                    <span className="text-xs text-on-surface-variant font-medium">Posisi kamu</span>
                    <div className="flex-1 h-px bg-outline-variant" />
                  </div>
                  <ListRow entry={currentUser} isCurrentUser={true} />
                </>
              )}
            </div>
          </div>
        )}

        {leaderboard.length === 0 && (
          <p className="text-on-surface-variant text-center py-12">Belum ada data leaderboard.</p>
        )}
      </div>
    </div>
  )
}
