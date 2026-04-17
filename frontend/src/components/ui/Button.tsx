import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '../../utils/styles'

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
  }
>

const variants = {
  primary: 'bg-app-primary text-white hover:bg-app-primary-hover',
  secondary: 'bg-app-primary-soft text-app-primary hover:bg-green-100',
  ghost: 'bg-transparent text-app-muted hover:bg-app-surface-muted hover:text-app-text',
  danger: 'bg-app-danger-soft text-app-danger hover:bg-red-100',
}

const sizes = {
  sm: 'min-h-9 px-3 text-sm',
  md: 'min-h-10 px-4 text-sm',
  lg: 'min-h-12 px-5 text-base',
}

export function Button({
  children,
  className,
  size = 'md',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg border-0 font-bold transition disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
