'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { slideVariants } from '@/lib/animations'
import MaterialSlide from './MaterialSlide'
import Button from '@/components/ui/Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function MaterialViewer({ cards }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const isEmpty = !cards || cards.length === 0

  function goTo(index) {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  function goPrev() {
    if (currentIndex <= 0) return
    goTo(currentIndex - 1)
  }

  function goNext() {
    if (!cards || currentIndex >= cards.length - 1) return
    goTo(currentIndex + 1)
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
      <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_4px_12px_rgba(0,93,167,0.08)] min-h-48 p-4 sm:p-6">
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

      <div className="mt-2 flex md:flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={goPrev}
          disabled={currentIndex <= 0}
          className="w-fit sm:w-full flex items-center justify-center gap-2"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Button>

        <div className="text-center text-xs sm:text-sm text-on-surface-variant w-fit mx-auto">
          {currentIndex + 1} / {cards.length}
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={goNext}
          disabled={currentIndex >= cards.length - 1}
          className="w-fit sm:w-full flex items-center justify-center gap-2"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
