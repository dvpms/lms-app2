import QuizOptions from './QuizOptions'

export default function QuizQuestion({ question, selectedOptionId, onSelect, index }) {
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
      />
    </div>
  )
}
