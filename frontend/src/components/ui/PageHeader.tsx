import type { PropsWithChildren, ReactNode } from 'react'

type PageHeaderProps = PropsWithChildren<{
  eyebrow?: string
  title: string
  actions?: ReactNode
}>

export function PageHeader({ actions, children, eyebrow, title }: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-5 max-sm:flex-col max-sm:items-stretch">
      <div>
        {eyebrow ? (
          <p className="mb-1 text-xs font-extrabold uppercase tracking-normal text-app-primary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-extrabold leading-tight text-app-text sm:text-4xl">{title}</h1>
        {children ? <div className="mt-2 text-app-muted">{children}</div> : null}
      </div>

      {actions ? <div className="flex flex-wrap gap-2 max-sm:flex-col">{actions}</div> : null}
    </header>
  )
}
