import clsx from 'clsx'

export default function Card({ children, className, ...rest }) {
  return (
    <div
      className={clsx(
        'bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_12px_rgba(0,93,167,0.08)]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
