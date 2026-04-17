import type { HTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '../../utils/styles'

type BadgeProps = PropsWithChildren<
  HTMLAttributes<HTMLSpanElement> & {
    variant?: 'neutral' | 'success' | 'danger' | 'primary'
  }
>

const variants = {
  neutral: 'bg-app-surface-muted text-app-muted',
  success: 'bg-app-primary-soft text-app-success',
  danger: 'bg-app-danger-soft text-app-danger',
  primary: 'bg-app-primary-soft text-app-primary',
}

export function Badge({ children, className, variant = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
