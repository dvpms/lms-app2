import clsx from 'clsx'

export default function Input({
  label,
  error,
  id,
  className,
  startIcon,
  endIcon,
  endElement,
  ...rest
}) {
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
      <div className="relative group">
        {startIcon && (
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant transition-colors group-focus-within:text-primary">
            {startIcon}
          </span>
        )}
        <input
          id={inputId}
          className={clsx(
            'w-full min-h-12 rounded-xl bg-surface-container-low py-3 text-on-surface outline-none ring-1 ring-outline-variant transition-all',
            startIcon ? 'pl-10 pr-4' : 'px-4',
            endIcon || endElement ? 'pr-10' : null,
            'placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-primary',
            error && 'ring-error focus:ring-error',
            className,
          )}
          {...rest}
        />
        {endIcon && (
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-on-surface-variant transition-colors group-focus-within:text-primary">
            {endIcon}
          </span>
        )}
        {endElement && (
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant transition-colors group-focus-within:text-primary">
            {endElement}
          </span>
        )}
      </div>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  )
}
