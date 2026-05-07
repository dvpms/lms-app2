/**
 * Button Styles - Extracted for proper Tailwind content scanning
 * Tailwind needs to see these strings in files it scans
 */

export const BUTTON_VARIANTS = {
  primary:
    'bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed-dim',
  secondary: 'bg-primary text-on-primary hover:bg-primary-container',
  ghost: 'bg-transparent text-primary hover:bg-surface-container-low border-2 border-outline-variant',
}

export const BUTTON_SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export const BUTTON_BASE =
  'min-h-12 rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'

export const BUTTON_DISABLED = 'opacity-50 cursor-not-allowed'
