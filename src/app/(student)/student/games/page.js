'use client'

import Link from 'next/link'
import { GAME_META } from '@/lib/gameData'
import Card from '@/components/ui/Card'
import { ArrowRight } from 'lucide-react'

export default function GamesPage() {
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
          {Object.entries(GAME_META).map(([type, meta]) => (
            <Link key={type} href={`/student/games/${type}`} className="group block">
              <Card className="ring-1 ring-outline-variant transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-2xl bg-primary-fixed flex items-center justify-center text-3xl shrink-0">
                    {meta.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-on-surface text-base">{meta.title}</h2>
                    <p className="text-sm text-on-surface-variant mt-0.5 line-clamp-2">
                      {meta.description}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {meta.levels.map((level) => (
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
