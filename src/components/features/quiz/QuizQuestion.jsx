import QuizOptions from './QuizOptions'

export default function QuizQuestion({ question, selectedOptionId, onSelect, index, feedbackState }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-semibold text-on-surface-variant">
        Soal {index + 1}
      </p>
      {question.image && (
        <img
          src={question.image}
          alt="Gambar soal"
          className="w-full rounded-xl object-cover max-h-48"
        />
      )}
      <p className="text-lg font-semibold text-on-surface">{question.text}</p>
      <QuizOptions
        options={question.options}
        selectedOptionId={selectedOptionId}
        onSelect={onSelect}
        feedbackState={feedbackState}
        disabled={!!feedbackState}
      />

      {feedbackState?.status === 'wrong' && (
        <div className="mt-2 rounded-2xl border border-error bg-error-container/30 p-4 flex flex-col gap-3">
          <div>
            <p className="font-semibold text-error">Jawaban salah</p>
            <p className="text-sm text-on-surface-variant mt-1">
              Ini cara penyelesaiannya:
            </p>
          </div>
          {question.solutionImage ? (
            <img
              src={question.solutionImage}
              alt="Cara penyelesaian"
              className="w-full rounded-xl border border-error/30 object-cover max-h-64"
            />
          ) : (
            <p className="text-sm text-on-surface-variant">
              Cara penyelesaian belum diunggah untuk soal ini.
            </p>
          )}
        </div>
      )}

      {feedbackState?.status === 'correct' && (
        <div className="mt-2 rounded-2xl border border-secondary bg-secondary-container/30 p-4">
          <p className="font-semibold text-secondary">Jawaban benar</p>
        </div>
      )}
    </div>
  )
}
