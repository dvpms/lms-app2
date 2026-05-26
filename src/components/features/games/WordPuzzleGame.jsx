'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { gameSuccessVariants } from '@/lib/animations'
import { usePostActivityMutation } from '@/lib/redux/api/activityApi'
import clsx from 'clsx'

function buildFoundSet(grid, hiddenWords) {
  return new Set()
}

function checkWordFound(selected, grid) {
  if (selected.length < 2) return null
  const letters = selected.map(([r, c]) => grid[r][c]).join('')
  return letters
}

export default function WordPuzzleGame({ level, onComplete }) {
  const [selected, setSelected] = useState([])
  const [foundWords, setFoundWords] = useState([])
  const [completed, setCompleted] = useState(false)
  const [postActivity] = usePostActivityMutation()
  const awardingRef = useRef(false)
  const completedRef = useRef(false)
  completedRef.current = completed

  async function awardPointsOnce() {
    if (completedRef.current || awardingRef.current) return
    awardingRef.current = true
    try {
      await postActivity({ type: 'GAME', activityId: level.id, points: level.points }).unwrap()
      completedRef.current = true
      setCompleted(true)
      onComplete?.()
    } catch {
      // If awarding fails, keep the level incomplete so the user can retry.
    } finally {
      awardingRef.current = false
    }
  }

  function isCellSelected(row, col) {
    return selected.some(([r, c]) => r === row && c === col)
  }

  function isCellFound(row, col) {
    return foundWords.some((fw) =>
      fw.cells.some(([r, c]) => r === row && c === col),
    )
  }

  function handleCellClick(row, col) {
    if (completed) return

    const alreadySelected = isCellSelected(row, col)
    const newSelected = alreadySelected
      ? selected.filter(([r, c]) => !(r === row && c === col))
      : [...selected, [row, col]]

    setSelected(newSelected)

    const word = newSelected.map(([r, c]) => level.grid[r][c]).join('')
    const matchedWord = level.hiddenWords.find(
      (hw) => hw === word || hw === word.split('').reverse().join(''),
    )

    if (matchedWord && !foundWords.find((fw) => fw.word === matchedWord)) {
      const updated = [...foundWords, { word: matchedWord, cells: newSelected }]
      setFoundWords(updated)
      setSelected([])

      if (updated.length === level.hiddenWords.length && !completed) {
        void awardPointsOnce()
      }
    }
  }

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex flex-wrap gap-2 justify-center">
        {level.hiddenWords.map((word) => {
          const found = foundWords.find((fw) => fw.word === word)
          return (
            <span
              key={word}
              className={clsx(
                'px-3 py-1 rounded-full text-sm font-semibold',
                found
                  ? 'bg-secondary-container text-on-secondary-container line-through'
                  : 'bg-surface-container text-on-surface-variant',
              )}
            >
              {word}
            </span>
          )
        })}
      </div>

      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${level.grid[0].length}, 2.5rem)` }}>
        {level.grid.map((row, rowIndex) =>
          row.map((letter, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              className={clsx(
                'size-10 rounded-lg text-sm font-bold transition-colors',
                isCellFound(rowIndex, colIndex)
                  ? 'bg-secondary-container text-on-secondary-container'
                  : isCellSelected(rowIndex, colIndex)
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-lowest text-on-surface border border-outline-variant hover:bg-surface-container-low',
              )}
            >
              {letter}
            </button>
          )),
        )}
      </div>

      <AnimatePresence>
        {completed && (
          <motion.div
            variants={gameSuccessVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-center bg-secondary-container text-on-secondary-container rounded-xl p-4 font-semibold"
          >
            🎉 Semua kata ditemukan! +{level.points} poin
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
