import clsx from 'clsx'

export default function Input({ label, error, id, className, ...rest }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-on-surface-variant"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          'w-full min-h-12 rounded-xl border-2 border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface transition-colors',
          'focus:border-primary focus:outline-none',
          error && 'border-error focus:border-error',
          className,
        )}
        {...rest}
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  )
}
