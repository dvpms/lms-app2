'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { slideVariants } from '@/lib/animations'
import MaterialSlide from './MaterialSlide'

export default function MaterialViewer({ cards }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const isEmpty = !cards || cards.length === 0

  function goTo(index) {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  if (isEmpty) {
    return (
      <div className="flex items-center justify-center min-h-48 rounded-xl bg-surface-container p-6">
        <MaterialSlide item={null} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_4px_12px_rgba(0,93,167,0.08)] min-h-48 p-6">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <MaterialSlide item={cards[currentIndex]} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-2">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Kartu ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === currentIndex
                ? 'w-6 bg-primary'
                : 'w-2 bg-outline-variant'
            }`}
          />
        ))}
      </div>

      <p className="text-center text-sm text-on-surface-variant">
        {currentIndex + 1} / {cards.length}
      </p>
    </div>
  )
}
