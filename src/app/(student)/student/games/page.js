'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import { ArrowRight } from 'lucide-react'

export default function GamesPage() {
  const [games, setGames] = useState(null)

  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await fetch('/api/games')
        const json = await res.json()
        setGames(json.data ?? [])
      } catch {
        setGames([])
      }
    }

    fetchGames()
  }, [])

  if (games === null) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto pb-28">
      <div className="max-w-2xl mx-auto px-6 pt-6 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Games</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Pilih game dan selesaikan semua level untuk mendapatkan poin
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {games.length === 0 ? (
            <Card>
              <div className="text-center py-12 text-on-surface-variant">
                <p className="font-semibold">Belum ada game</p>
                <p className="text-sm mt-1">Game akan muncul setelah diatur oleh admin.</p>
              </div>
            </Card>
          ) : games.map((game) => (
            <Link key={game.type} href={`/student/games/${game.type}`} className="group block">
              <Card className="ring-1 ring-outline-variant transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-2xl bg-primary-fixed flex items-center justify-center text-3xl shrink-0">
                    {game.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-on-surface text-base">{game.title}</h2>
                    <p className="text-sm text-on-surface-variant mt-0.5 line-clamp-2">
                      {game.description}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {(game.levels ?? []).map((level) => (
                        <span key={level.id} className="text-xs text-on-surface-variant">
                          {'⭐'.repeat(level.difficulty)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-on-surface-variant group-hover:text-primary transition-colors shrink-0"
                  />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
