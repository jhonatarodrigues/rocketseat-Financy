import type { PropsWithChildren, ReactNode } from 'react'
import { Button } from './Button'

type DialogProps = PropsWithChildren<{
  title: string
  footer?: ReactNode
  onClose: () => void
}>

export function Dialog({ children, footer, title, onClose }: DialogProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-5" role="presentation">
      <section
        className="w-full max-w-xl rounded-xl bg-app-surface p-6 shadow-soft"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <header className="mb-5 flex items-center justify-between gap-4">
          <h2 id="dialog-title" className="text-xl font-bold text-app-text">
            {title}
          </h2>
          <Button type="button" variant="ghost" onClick={onClose}>
            Fechar
          </Button>
        </header>

        {children}

        {footer ? <footer className="mt-5 flex justify-end gap-2 max-sm:flex-col">{footer}</footer> : null}
      </section>
    </div>
  )
}
