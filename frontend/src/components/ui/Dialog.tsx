import type { PropsWithChildren, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../utils/styles'

type DialogProps = PropsWithChildren<{
  description?: string
  title: string
  footerClassName?: string
  headerClassName?: string
  panelClassName?: string
  titleClassName?: string
  footer?: ReactNode
  onClose: () => void
}>

export function Dialog({
  children,
  description,
  footer,
  footerClassName,
  headerClassName,
  panelClassName,
  titleClassName,
  title,
  onClose,
}: DialogProps) {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 grid place-items-center bg-[#111827]/45 p-5"
      initial={{ opacity: 0 }}
      role="presentation"
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <motion.section
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={cn(
          'w-full rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-[0_20px_25px_-5px_rgb(17_24_39_/_0.1),0_8px_10px_-6px_rgb(17_24_39_/_0.1)]',
          panelClassName ? '' : 'max-w-xl',
          panelClassName,
        )}
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <header className={cn('mb-5 flex items-start justify-between gap-4', headerClassName)}>
          <div className="min-w-0 flex-1">
            <h2 id="dialog-title" className={cn('text-xl font-bold leading-7 text-[#111827]', titleClassName)}>
              {title}
            </h2>
            {description ? <p className="mt-0.5 truncate text-sm leading-5 text-[#4b5563]">{description}</p> : null}
          </div>
          <button
            type="button"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[#4b5563] transition hover:bg-[#f3f4f6] hover:text-[#111827]"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </header>

        {children}

        {footer ? (
          <footer className={cn('mt-5 flex justify-end gap-2 max-sm:flex-col', footerClassName)}>
            {footer}
          </footer>
        ) : null}
      </motion.section>
    </motion.div>
  )
}
