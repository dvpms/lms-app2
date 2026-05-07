'use client'

import { motion } from 'framer-motion'
import clsx from 'clsx'

const variantClasses = {
  primary: 'bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed-dim',
  secondary: 'bg-primary text-on-primary hover:bg-primary-container',
  ghost: 'bg-transparent text-primary hover:bg-surface-container-low border-2 border-outline-variant',
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  onClick,
  type = 'button',
  ...rest
}) {
  return (
    <motion.button
      type={type}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'min-h-12 rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
