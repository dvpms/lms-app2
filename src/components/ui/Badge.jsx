import clsx from 'clsx'

const variantClasses = {
  default: 'bg-tertiary-container text-on-tertiary-container',
  primary: 'bg-primary text-on-primary',
  secondary: 'bg-secondary-container text-on-secondary-container',
  error: 'bg-error-container text-on-error-container',
}

export default function Badge({ children, variant = 'default', className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
