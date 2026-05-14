'use client'

import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function Spinner({ size = 'md', className }) {
  const sizeClasses = {
    sm: 'size-4',
    md: 'size-8',
    lg: 'size-12',
  }

  return (
    <motion.div
      className={clsx(
        'rounded-full border-4 border-surface-container-high border-t-primary',
        sizeClasses[size],
        className,
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      role="status"
      aria-label="Loading"
    />
  )
}
