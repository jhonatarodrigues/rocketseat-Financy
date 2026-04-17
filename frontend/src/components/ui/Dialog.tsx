import type { PropsWithChildren, ReactNode } from 'react'
import { X } from 'lucide-react'

type DialogProps = PropsWithChildren<{
  title: string
  footer?: ReactNode
  onClose: () => void
}>

export function Dialog({ children, footer, title, onClose }: DialogProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#111827]/45 p-5" role="presentation">
      <section
        className="w-full max-w-xl rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-[0_20px_25px_-5px_rgb(17_24_39_/_0.1),0_8px_10px_-6px_rgb(17_24_39_/_0.1)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <header className="mb-5 flex items-center justify-between gap-4">
          <h2 id="dialog-title" className="text-xl font-bold leading-7 text-[#111827]">
            {title}
          </h2>
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-md text-[#4b5563] transition hover:bg-[#f3f4f6] hover:text-[#111827]"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </header>

        {children}

        {footer ? <footer className="mt-5 flex justify-end gap-2 max-sm:flex-col">{footer}</footer> : null}
      </section>
    </div>
  )
}
