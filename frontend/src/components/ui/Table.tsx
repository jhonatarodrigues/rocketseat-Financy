import type { HTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '../../utils/styles'

export function Table({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={cn('overflow-hidden rounded-lg border border-app-border', className)} {...props}>
      {children}
    </div>
  )
}

export function TableRow({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLElement>>) {
  return (
    <article
      className={cn(
        'grid min-h-[72px] items-center gap-3 border-b border-app-border bg-app-surface p-3 last:border-b-0',
        className,
      )}
      {...props}
    >
      {children}
    </article>
  )
}
