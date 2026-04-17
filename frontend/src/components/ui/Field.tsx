import type { InputHTMLAttributes, PropsWithChildren, SelectHTMLAttributes } from 'react'
import { cn } from '../../utils/styles'

type FieldProps = PropsWithChildren<{
  label: string
  error?: string
}>

export function Field({ label, error, children }: FieldProps) {
  return (
    <label className="grid gap-2 text-sm font-medium leading-5 text-[#374151]">
      <span>{label}</span>
      {children}
      {error ? <span className="text-xs font-semibold text-app-danger">{error}</span> : null}
    </label>
  )
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean
}

export function Input({ className, hasError, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'h-12 w-full rounded-lg border bg-white px-[13px] py-[15px] text-base leading-[18px] text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-app-primary focus:ring-4 focus:ring-app-primary-soft',
        hasError ? 'border-app-danger' : 'border-app-border',
        className,
      )}
      {...props}
    />
  )
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  hasError?: boolean
}

export function Select({ className, hasError, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'h-12 w-full rounded-lg border bg-white px-[13px] py-[15px] text-base leading-[18px] text-[#111827] outline-none transition focus:border-app-primary focus:ring-4 focus:ring-app-primary-soft',
        hasError ? 'border-app-danger' : 'border-app-border',
        className,
      )}
      {...props}
    />
  )
}
