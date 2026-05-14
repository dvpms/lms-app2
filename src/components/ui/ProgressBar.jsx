import clsx from 'clsx'

export default function ProgressBar({ value = 0, className }) {
  const clampedValue = Math.min(100, Math.max(0, value))

  return (
    <div
      className={clsx('h-3 w-full rounded-full bg-surface-container-high overflow-hidden', className)}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-secondary-container transition-all duration-300"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  )
}
