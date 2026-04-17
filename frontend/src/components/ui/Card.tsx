import type { HTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '../../utils/styles'

type CardProps = PropsWithChildren<HTMLAttributes<HTMLElement>>

export function Card({ children, className, ...props }: CardProps) {
  return (
    <section
      className={cn('rounded-xl border border-app-border bg-app-surface shadow-soft', className)}
      {...props}
    >
      {children}
    </section>
  )
}
