'use client'

import clsx from 'clsx'

export default function QuizOptions({ options, selectedOptionId, onSelect }) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => {
        const isSelected = option.id === selectedOptionId
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={clsx(
              'w-full text-left px-4 py-3 rounded-xl border-2 transition-colors font-medium min-h-12',
              isSelected
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
