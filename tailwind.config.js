/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    // Surface colors
    { pattern: /^(bg|text|border)-(surface|on-surface|surface-dim|surface-bright|surface-container|surface-variant|inverse-surface|inverse-on-surface)(-.*)?$/ },
    // Primary colors
    { pattern: /^(bg|text)-(primary|on-primary|primary-container|on-primary-container|inverse-primary|primary-fixed|primary-fixed-dim|on-primary-fixed|on-primary-fixed-variant)(-.*)?$/ },
    // Secondary colors
    { pattern: /^(bg|text)-(secondary|on-secondary|secondary-container|on-secondary-container|secondary-fixed|secondary-fixed-dim|on-secondary-fixed|on-secondary-fixed-variant)(-.*)?$/ },
    // Tertiary colors
    { pattern: /^(bg|text)-(tertiary|on-tertiary|tertiary-container|on-tertiary-container|tertiary-fixed|tertiary-fixed-dim|on-tertiary-fixed|on-tertiary-fixed-variant)(-.*)?$/ },
    // Error colors
    { pattern: /^(bg|text)-(error|on-error|error-container|on-error-container)(-.*)?$/ },
    // Outline colors
    { pattern: /^border-(outline|outline-variant)(-.*)?$/ },
    // Background colors
    { pattern: /^(bg|text)-background(-.*)?$/ },
    // Hover states
    'hover:bg-secondary-fixed-dim',
    'hover:bg-primary-container',
    'hover:bg-surface-container-low',
    'hover:underline',
    // Ring states
    'focus:ring-2',
    'focus:ring-primary',
    'focus:ring-offset-2',
    'focus:outline-none',
    'focus:border-primary',
    'focus:border-error',
    // Border & radius
    'border-2',
    'border-error',
    'rounded-xl',
    'rounded-full',
    // Utilities
    'opacity-50',
    'cursor-not-allowed',
    'transition-colors',
  ],
}
