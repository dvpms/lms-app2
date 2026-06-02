'use client'

import Link from 'next/link'
import { useGetQuizzesQuery } from '@/lib/redux/api/quizzesApi'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import { ArrowRight, HelpCircle } from 'lucide-react'

export default function QuizListPage() {
  const { data, isLoading, isError } = useGetQuizzesQuery()
  const quizzes = data?.data ?? []

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner />
      </div>
    )
  }

  if (isError) {
    return <p className="text-error text-center p-6">Gagal memuat daftar quiz.</p>
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-28">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        <div className="pt-2 pb-2">
          <h1 className="text-2xl font-bold text-on-surface">Quiz</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Pilih quiz untuk menguji pemahamanmu
          </p>
        </div>

        {quizzes.length === 0 && (
          <Card>
            <div className="text-center py-12 text-on-surface-variant">
              <HelpCircle size={40} className="mx-auto mb-3 opacity-40" />
              <p className="font-semibold">Belum ada quiz tersedia</p>
              <p className="text-sm mt-1">Cek lagi nanti ya!</p>
            </div>
          </Card>
        )}

        {quizzes.map((quiz) => {
          const questionCount = quiz.questions?.length ?? 0
          const totalPoints = quiz.questions?.reduce((sum, q) => sum + (q.points ?? 0), 0) ?? 0
          const associatedWith = quiz.material?.title ?? quiz.subject?.title ?? null

          return (
            <Link key={quiz.id} href={`/student/quiz/${quiz.id}`} className="group block">
              <Card className="ring-1 ring-outline-variant transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-xl bg-primary-fixed flex items-center justify-center shrink-0">
                    <HelpCircle size={22} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-on-surface text-base leading-snug">
                      {quiz.title}
                    </h2>
                    {associatedWith && (
                      <p className="text-xs text-on-surface-variant mt-0.5">{associatedWith}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {totalPoints > 0 && (
                        <span className="text-xs text-secondary font-semibold">
                          +{totalPoints} poin
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-on-surface-variant group-hover:text-primary transition-colors shrink-0 mt-1"
                  />
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
