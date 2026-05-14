'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import {
  wordArrangementLevels,
  wordPuzzleLevels,
  multiplicationPuzzleLevels,
} from '@/lib/gameData'
import WordArrangementGame from '@/components/features/games/WordArrangementGame'
import WordPuzzleGame from '@/components/features/games/WordPuzzleGame'
import MultiplicationPuzzleGame from '@/components/features/games/MultiplicationPuzzleGame'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

const gameConfig = {
  'word-arrangement': {
    title: 'Susun Kata',
    levels: wordArrangementLevels,
    Component: WordArrangementGame,
  },
  'word-puzzle': {
    title: 'Teka-Teki Kata',
    levels: wordPuzzleLevels,
    Component: WordPuzzleGame,
  },
  'multiplication-puzzle': {
    title: 'Puzzle Perkalian',
    levels: multiplicationPuzzleLevels,
    Component: MultiplicationPuzzleGame,
  },
}

export default function GamePage() {
  const { type } = useParams()
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [levelCompleted, setLevelCompleted] = useState(false)

  const config = gameConfig[type]

  if (!config) {
    return <p className="text-error text-center p-6">Game tidak ditemukan.</p>
  }

  const { title, levels, Component } = config
  const currentLevel = levels[currentLevelIndex]
  const isLastLevel = currentLevelIndex === levels.length - 1

  function handleComplete() {
    setLevelCompleted(true)
  }

  function handleNextLevel() {
    setCurrentLevelIndex((i) => i + 1)
    setLevelCompleted(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">{title}</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Level {currentLevelIndex + 1} / {levels.length}
        </p>
      </div>

      <Card>
        <Component
          key={`${type}-${currentLevelIndex}`}
          level={currentLevel}
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
