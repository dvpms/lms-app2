import clsx from 'clsx'

const rankEmoji = { 1: '🥇', 2: '🥈', 3: '🥉' }

function RankCell({ rank }) {
  return (
    <span className="font-bold text-on-surface-variant">
      {rankEmoji[rank] ?? `#${rank}`}
    </span>
  )
}

export default function LeaderboardTable({ entries, currentUserId }) {
  if (!entries || entries.length === 0) {
    return <p className="text-on-surface-variant text-center py-8">Belum ada data.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map((entry) => {
        const isCurrentUser = entry.id === currentUserId
        return (
          <div
            key={entry.id}
            className={clsx(
              'flex items-center gap-4 px-4 py-3 rounded-xl transition-colors',
              isCurrentUser
                ? 'bg-primary-fixed border-2 border-primary'
                : 'bg-surface-container-lowest shadow-[0_4px_12px_rgba(0,93,167,0.08)]',
            )}
          >
            <div className="w-10 text-center">
              <RankCell rank={entry.rank} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={clsx('font-semibold truncate', isCurrentUser ? 'text-primary' : 'text-on-surface')}>
                {entry.name}
                {isCurrentUser && <span className="ml-2 text-xs font-normal text-primary">(Kamu)</span>}
              </p>
              <p className="text-xs text-on-surface-variant">Level {entry.level}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-secondary">{entry.points}</p>
              <p className="text-xs text-on-surface-variant">poin</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
