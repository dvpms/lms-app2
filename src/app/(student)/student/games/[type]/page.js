'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Lock, Star, CheckCircle } from 'lucide-react'
import { GAME_META } from '@/lib/gameData'
import WordArrangementGame from '@/components/features/games/WordArrangementGame'
import WordPuzzleGame from '@/components/features/games/WordPuzzleGame'
import MultiplicationPuzzleGame from '@/components/features/games/MultiplicationPuzzleGame'
import Spinner from '@/components/ui/Spinner'
import { motion, AnimatePresence } from 'framer-motion'
import { gameSuccessVariants } from '@/lib/animations'

const GAME_COMPONENTS = {
  'word-arrangement': WordArrangementGame,
  'word-puzzle': WordPuzzleGame,
  'multiplication-puzzle': MultiplicationPuzzleGame,
}

function DifficultyStars({ difficulty }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= difficulty ? 'text-[#FFD700] fill-[#FFD700]' : 'text-outline-variant'}
        />
      ))}
    </div>
  )
}

export default function GamePage() {
  const { type } = useParams()
  const router = useRouter()

  const meta = GAME_META[type]
  const GameComponent = GAME_COMPONENTS[type]

  const [completedLevelIds, setCompletedLevelIds] = useState(null) // null = loading
  const [activeLevel, setActiveLevel] = useState(null)
  const [levelJustCompleted, setLevelJustCompleted] = useState(false)

  // Fetch completed levels from ActivityLog via /api/activity/completed
  useEffect(() => {
    if (!meta) return
    async function fetchCompleted() {
      try {
        const ids = meta.levels.map((l) => l.id)
        const res = await fetch(`/api/activity/completed?ids=${ids.join(',')}`)
        if (!res.ok) {
          setCompletedLevelIds(new Set())
          return
        }
        const json = await res.json()
        setCompletedLevelIds(new Set(json.data ?? []))
      } catch {
        setCompletedLevelIds(new Set())
      }
    }
    fetchCompleted()
  }, [meta])

  if (!meta || !GameComponent) {
    return <p className="text-error text-center p-6">Game tidak ditemukan.</p>
  }

  if (completedLevelIds === null) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner />
      </div>
    )
  }

  function isLevelUnlocked(index) {
    if (index === 0) return true
    const prevLevel = meta.levels[index - 1]
    return completedLevelIds.has(prevLevel.id)
  }

  function handleLevelComplete(levelId) {
    setCompletedLevelIds((prev) => new Set([...prev, levelId]))
    setLevelJustCompleted(true)
  }

  function handleNextLevel() {
    setLevelJustCompleted(false)
    const currentIndex = meta.levels.findIndex((l) => l.id === activeLevel.id)
    const next = meta.levels[currentIndex + 1]
    if (next) {
      setActiveLevel(next)
    } else {
      setActiveLevel(null)
    }
  }

  // Level selection screen
  if (!activeLevel) {
    const allDone = meta.levels.every((l) => completedLevelIds.has(l.id))

    return (
      <div className="flex-1 overflow-y-auto pb-28">
        <div className="max-w-2xl mx-auto px-6 pt-6 flex flex-col gap-6">
          <button
            onClick={() => router.push('/student/games')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors w-fit"
          >
            <ArrowLeft size={16} />
            Kembali
          </button>

          <div className="flex items-center gap-3">
            <span className="text-4xl">{meta.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold text-on-surface">{meta.title}</h1>
              <p className="text-sm text-on-surface-variant mt-0.5">{meta.description}</p>
            </div>
          </div>

          {allDone && (
            <div className="bg-secondary-container text-on-secondary-container rounded-2xl p-4 text-center font-semibold">
              🏆 Semua level selesai! Kamu luar biasa!
            </div>
          )}

          <div className="flex flex-col gap-3">
            {meta.levels.map((level, index) => {
              const unlocked = isLevelUnlocked(index)
              const done = completedLevelIds.has(level.id)

              return (
                <button
                  key={level.id}
                  onClick={() => unlocked && setActiveLevel(level)}
                  disabled={!unlocked}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                    done
                      ? 'border-secondary bg-secondary-container/30'
                      : unlocked
                        ? 'border-primary bg-primary-fixed hover:shadow-md hover:-translate-y-0.5'
                        : 'border-outline-variant bg-surface-container opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${
                      done
                        ? 'bg-secondary-container'
                        : unlocked
                          ? 'bg-primary'
                          : 'bg-surface-container-high'
                    }`}
                  >
                    {done ? (
                      <CheckCircle size={22} className="text-secondary" />
                    ) : unlocked ? (
                      <span className="text-on-primary font-bold text-lg">{index + 1}</span>
                    ) : (
                      <Lock size={18} className="text-on-surface-variant" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${done ? 'text-secondary' : unlocked ? 'text-primary' : 'text-on-surface-variant'}`}>
                      Level {index + 1}
                    </p>
                    <DifficultyStars difficulty={level.difficulty} />
                  </div>

                  <div className="text-right shrink-0">
                    <p className={`text-sm font-bold ${done ? 'text-secondary' : unlocked ? 'text-primary' : 'text-on-surface-variant'}`}>
                      +{level.points} poin
                    </p>
                    {!unlocked && (
                      <p className="text-xs text-on-surface-variant mt-0.5">Terkunci</p>
                    )}
                    {done && (
                      <p className="text-xs text-secondary mt-0.5">Selesai</p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Active game screen
  const currentIndex = meta.levels.findIndex((l) => l.id === activeLevel.id)
  const hasNext = currentIndex < meta.levels.length - 1

  return (
    <div className="flex-1 overflow-y-auto pb-28">
      <div className="max-w-2xl mx-auto px-6 pt-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => { setActiveLevel(null); setLevelJustCompleted(false) }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Pilih Level
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-on-surface-variant">Level {currentIndex + 1}</span>
            <DifficultyStars difficulty={activeLevel.difficulty} />
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl shadow-[0_4px_12px_rgba(0,93,167,0.08)] border border-outline-variant/30 p-5">
          <GameComponent
            key={activeLevel.id}
            level={activeLevel}
            onComplete={() => handleLevelComplete(activeLevel.id)}
          />
        </div>

        <AnimatePresence>
          {levelJustCompleted && (
            <motion.div
              variants={gameSuccessVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-3"
            >
              {hasNext ? (
                <button
                  onClick={handleNextLevel}
                  className="w-full py-3 rounded-xl bg-secondary-container text-on-secondary-container font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Level Berikutnya →
                </button>
              ) : (
                <button
                  onClick={() => { setActiveLevel(null); setLevelJustCompleted(false) }}
                  className="w-full py-3 rounded-xl bg-secondary-container text-on-secondary-container font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  🏆 Semua Level Selesai!
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
