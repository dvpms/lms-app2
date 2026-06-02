'use client'

import Card from '@/components/ui/Card'

export default function QuizReview({ details = [] }) {
  if (!details.length) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-on-surface">Review Jawaban</h3>
      <div className="flex flex-col gap-4">
        {details.map((detail, index) => (
          <Card key={detail.questionId} className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-on-surface-variant">Soal {index + 1}</p>
                <p className="mt-1 font-semibold text-on-surface">{detail.questionText}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${detail.isCorrect ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'}`}
              >
                {detail.isCorrect ? 'Benar' : 'Salah'}
              </span>
            </div>

            <div className="grid gap-3 text-sm">
              <div className="rounded-xl bg-surface-container-low p-3">
                <p className="text-on-surface-variant">Jawaban kamu</p>
                <p className="mt-1 font-semibold text-on-surface">
                  {detail.selectedOptionText ?? 'Belum dijawab'}
                </p>
              </div>
              <div className="rounded-xl bg-surface-container-low p-3">
                <p className="text-on-surface-variant">Jawaban benar</p>
                <p className="mt-1 font-semibold text-on-surface">
                  {detail.correctOptionText ?? 'Tidak tersedia'}
                </p>
              </div>
            </div>

            {detail.solutionImage ? (
              <div className="rounded-2xl border border-outline-variant overflow-hidden">
                <img
                  src={detail.solutionImage}
                  alt={`Penyelesaian soal ${index + 1}`}
                  className="w-full max-h-72 object-cover"
                />
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">
                Penyelesaian belum diunggah untuk soal ini.
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
