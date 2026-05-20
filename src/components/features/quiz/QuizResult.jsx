'use client'

import { motion } from 'framer-motion'
import { gameSuccessVariants } from '@/lib/animations'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function QuizResult({ score, totalQuestions, correctCount, pointsEarned, onRetry, alreadyCompleted }) {
  const percentage = totalQuestions > 0 && correctCount !== null
    ? Math.round((correctCount / totalQuestions) * 100)
    : null

  return (
    <motion.div
      variants={gameSuccessVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="text-center flex flex-col gap-4">
        <div className="text-5xl">{alreadyCompleted ? '📋' : '🎉'}</div>
        <h2 className="text-2xl font-bold text-on-surface">
          {alreadyCompleted ? 'Sudah Dikerjakan' : 'Quiz Selesai!'}
        </h2>
        {alreadyCompleted && (
          <p className="text-sm text-on-surface-variant">
            Kamu sudah mengerjakan quiz ini sebelumnya. Berikut hasil terakhirmu.
          </p>
        )}
        <div className="flex flex-col gap-2">
          <p className="text-4xl font-bold text-primary">{score}</p>
          <p className="text-on-surface-variant">Skor kamu</p>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {correctCount !== null && (
            <div className="bg-surface-container rounded-xl p-4">
              <p className="text-2xl font-bold text-secondary">{correctCount}</p>
              <p className="text-sm text-on-surface-variant">Benar dari {totalQuestions}</p>
            </div>
          )}
          <div className={`bg-surface-container rounded-xl p-4 ${correctCount === null ? 'col-span-2' : ''}`}>
            <p className="text-2xl font-bold text-tertiary-container">
              {alreadyCompleted ? '—' : `+${pointsEarned}`}
            </p>
            <p className="text-sm text-on-surface-variant">
              {alreadyCompleted ? 'Poin tidak ditambahkan' : 'Poin didapat'}
            </p>
          </div>
        </div>
        {percentage !== null && (
          <p className="text-on-surface-variant text-sm">{percentage}% jawaban benar</p>
        )}
        {onRetry && (
          <Button variant="ghost" onClick={onRetry} className="mt-2">
            Lihat Lagi
          </Button>
        )}
      </Card>
    </motion.div>
  )
}
