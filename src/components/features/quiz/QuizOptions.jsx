'use client'

import clsx from 'clsx'

export default function QuizOptions({ options, selectedOptionId, onSelect, feedbackState, disabled = false }) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => {
        const isSelected = option.id === selectedOptionId
        const isCorrectAnswer = option.isCorrect
        const status = feedbackState?.status
        const isLocked = disabled || !!status
        return (
          <button
            key={option.id}
            type="button"
            disabled={isLocked}
            onClick={() => onSelect(option.id)}
            className={clsx(
              'w-full text-left px-4 py-3 rounded-xl border-2 transition-colors font-medium min-h-12 disabled:cursor-not-allowed',
              status === 'wrong' && isSelected
                ? 'border-error bg-error-container text-on-error-container'
                : status === 'wrong' && isCorrectAnswer
                  ? 'border-secondary bg-secondary-container text-on-secondary-container'
                  : status === 'correct' && isSelected
                    ? 'border-secondary bg-secondary-container text-on-secondary-container'
                    : isSelected
                      ? 'border-primary bg-primary-fixed text-on-primary-fixed'
                      : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary hover:bg-surface-container-low',
            )}
          >
            {option.text}
          </button>
        )
      })}
    </div>
  )
}
