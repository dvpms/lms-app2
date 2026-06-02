'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import WordArrangementGame from '@/components/features/games/WordArrangementGame'
import WordPuzzleGame from '@/components/features/games/WordPuzzleGame'
import MultiplicationPuzzleGame from '@/components/features/games/MultiplicationPuzzleGame'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'

const GAME_COMPONENTS = {
  'word-arrangement': WordArrangementGame,
  'word-puzzle': WordPuzzleGame,
  'multiplication-puzzle': MultiplicationPuzzleGame,
}

export default function GamePage() {
  const { type } = useParams()
  const Component = GAME_COMPONENTS[type]
  const [games, setGames] = useState(null)
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [levelCompleted, setLevelCompleted] = useState(false)

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

  const config = useMemo(() => {
    const game = games?.find((item) => item.type === type)
    if (!game) return null
    return {
      title: game.title,
      description: game.description,
      emoji: game.emoji,
      levels: (game.levels ?? []).slice().sort((a, b) => a.order - b.order),
    }
  }, [games, type])

  if (!Component) {
    return <p className="text-error text-center p-6">Game tidak ditemukan.</p>
  }

  if (!games) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner />
      </div>
    )
  }

  if (!config) {
    return <p className="text-error text-center p-6">Game belum tersedia.</p>
  }

  const currentLevel = config.levels[currentLevelIndex]
  const isLastLevel = currentLevelIndex === config.levels.length - 1

  function handleComplete() {
    setLevelCompleted(true)
  }

  function handleNextLevel() {
    setCurrentLevelIndex((i) => i + 1)
    setLevelCompleted(false)
  }

  if (!currentLevel) {
    return <p className="text-error text-center p-6">Level game belum diatur.</p>
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">{config.title}</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          {config.description}
        </p>
        <p className="text-sm text-on-surface-variant mt-1">
          Level {currentLevelIndex + 1} / {config.levels.length}
        </p>
      </div>

      <Card>
        <Component
          key={`${type}-${currentLevelIndex}`}
          level={currentLevel.payload ? { ...currentLevel.payload, id: currentLevel.id, difficulty: currentLevel.difficulty, points: currentLevel.points } : currentLevel}
          onComplete={handleComplete}
        />
      </Card>

      {levelCompleted && !isLastLevel && (
        <Button onClick={handleNextLevel} className="w-full">
          Level Berikutnya →
        </Button>
      )}

      {levelCompleted && isLastLevel && (
        <div className="text-center bg-secondary-container text-on-secondary-container rounded-xl p-4 font-semibold">
          🏆 Semua level selesai!
        </div>
      )}
    </div>
  )
}
