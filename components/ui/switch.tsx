'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  size?: 'sm' | 'md'
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked = false, onCheckedChange, size = 'md', disabled, ...props }, ref) => {
    const handleClick = () => {
      if (!disabled) {
        onCheckedChange?.(!checked)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        handleClick()
      }
    }

    const trackSize = size === 'sm' ? 'h-5 w-9' : 'h-6 w-11'
    const thumbSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
    const thumbTranslate = size === 'sm'
      ? (checked ? 'translate-x-4' : 'translate-x-0')
      : (checked ? 'translate-x-5' : 'translate-x-0')

    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        ref={ref}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          'peer inline-flex shrink-0 cursor-pointer items-center border-2 border-transparent transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
          trackSize,
          checked ? 'bg-primary' : 'bg-muted',
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            'pointer-events-none inline-block transform bg-background ring-0 transition-transform duration-300 ease-in-out',
            thumbSize,
            thumbTranslate,
          )}
        />
      </button>
    )
  },
)

Switch.displayName = 'Switch'

export { Switch }
export type { SwitchProps }
