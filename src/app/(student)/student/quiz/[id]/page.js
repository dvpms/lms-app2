'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useGetQuizQuery, useSubmitQuizMutation } from '@/lib/redux/api/quizzesApi'
import { useDispatch } from 'react-redux'
import { setUser } from '@/lib/redux/slices/authSlice'
import QuizQuestion from '@/components/features/quiz/QuizQuestion'
import QuizResult from '@/components/features/quiz/QuizResult'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import Card from '@/components/ui/Card'
import { RotateCcw } from 'lucide-react'

export default function QuizPage() {
  const { id } = useParams()
  const { data: session } = useSession()
  const dispatch = useDispatch()

  const { data, isLoading, refetch } = useGetQuizQuery(id)
  const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizMutation()

  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isRetaking, setIsRetaking] = useState(false)

  const quiz = data?.data
  const questions = quiz?.questions ?? []
  const totalInBank = quiz?.totalQuestions ?? questions.length

  function handleSelectOption(questionId, optionId) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }

  async function handleSubmit() {
    const questionIds = questions.map((q) => q.id)
    const res = await submitQuiz({ id, answers, questionIds })
    if (res.data) {
      const { score, points, level } = res.data.data
      if (session?.user && points !== undefined) {
        dispatch(setUser({ ...session.user, points, level }))
      }
      const correctCount = questions.filter(
        (q) => q.options.find((o) => o.isCorrect)?.id === answers[q.id],
      ).length
      setResult({ score, points, level, correctCount })
    }
  }

  function handleRetake() {
    setAnswers({})
    setResult(null)
    setCurrentIndex(0)
    setIsRetaking(true)
    refetch()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner />
      </div>
    )
  }

  if (!quiz) {
    return <p className="text-error text-center p-6">Quiz tidak ditemukan.</p>
  }

  // Show latest submission result if student has done this quiz before (and not retaking)
  if (quiz.latestSubmission && !result && !isRetaking) {
    return (
      <div className="max-w-xl mx-auto px-6 py-8 flex flex-col gap-4">
        <QuizResult
          score={quiz.latestSubmission.score}
          totalQuestions={questions.length}
          correctCount={null}
          pointsEarned={quiz.latestSubmission.score}
          alreadyCompleted={false}
        />
        <Button
          onClick={handleRetake}
          variant="ghost"
          className="flex items-center gap-2 mx-auto"
        >
          <RotateCcw size={16} />
          Coba Lagi dengan Soal Baru
        </Button>
      </div>
    )
  }

  if (result) {
    return (
      <div className="max-w-xl mx-auto px-6 py-8 flex flex-col gap-4">
        <QuizResult
          score={result.score}
          totalQuestions={questions.length}
          correctCount={result.correctCount}
          pointsEarned={result.score}
          alreadyCompleted={false}
        />
        <Button
          onClick={handleRetake}
          variant="ghost"
          className="flex items-center gap-2 mx-auto"
        >
          <RotateCcw size={16} />
          Coba Lagi dengan Soal Baru
        </Button>
      </div>
    )
  }

  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === questions.length

  return (
    <div className="max-w-xl mx-auto px-6 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">{quiz.title}</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          {answeredCount} / {questions.length} soal dijawab
          {totalInBank > questions.length && (
            <span className="ml-2 text-xs text-on-surface-variant/60">
              (dari {totalInBank} soal di bank)
            </span>
          )}
        </p>
      </div>

      {questions[currentIndex] && (
        <Card>
          <QuizQuestion
            question={questions[currentIndex]}
            selectedOptionId={answers[questions[currentIndex].id]}
            onSelect={(optionId) => handleSelectOption(questions[currentIndex].id, optionId)}
            index={currentIndex}
          />
        </Card>
      )}

      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
        >
          Sebelumnya
        </Button>

        {currentIndex < questions.length - 1 ? (
          <Button onClick={() => setCurrentIndex((i) => i + 1)}>
            Selanjutnya
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered || isSubmitting}
          >
            {isSubmitting ? 'Mengirim...' : 'Kumpulkan'}
          </Button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrentIndex(i)}
            className={`size-8 rounded-full text-xs font-semibold transition-colors ${
              answers[q.id]
                ? 'bg-secondary-container text-on-secondary-container'
                : i === currentIndex
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
