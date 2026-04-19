import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { CircleArrowDown, CircleArrowUp } from 'lucide-react'
import {
  transactionSchema,
  type TransactionFormValues,
} from '../../features/finance/schemas/transactionSchema'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { Field, Input, Select } from '../ui/Field'
import type { Category, Transaction, TransactionInput } from '../../types/finance'

type TransactionDialogProps = {
  categories: Category[]
  transaction?: Transaction | null
  onClose: () => void
  onSubmit: (input: TransactionInput) => Promise<void> | void
}

const initialForm: TransactionInput = {
  title: '',
  amount: 0,
  type: 'expense',
  date: '',
  categoryId: '',
}

export function TransactionDialog({
  categories,
  transaction,
  onClose,
  onSubmit,
}: TransactionDialogProps) {
  const {
    formState: { errors, isSubmitting },
    control,
    handleSubmit,
    register,
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction
      ? {
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        date: toDateInputValue(transaction.date),
        categoryId: transaction.categoryId,
      }
      : {
        ...initialForm,
      },
  })

  async function submitForm(values: TransactionInput) {
    await onSubmit(values)
    onClose()
  }

  return (
    <Dialog
      description="Registre sua despesa ou receita"
      title={transaction ? 'Editar transação' : 'Nova transação'}
      onClose={onClose}
      panelClassName="max-w-[448px] rounded-[12px] p-[25px]"
      headerClassName="mb-6"
      titleClassName="text-base font-semibold leading-6"
      footerClassName="mt-6"
      footer={
        <Button type="submit" form="transaction-form" size="lg" className="h-12 w-full" disabled={isSubmitting}>
          Salvar
        </Button>
      }
    >
      <form id="transaction-form" className="grid gap-4" onSubmit={handleSubmit(submitForm)}>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <div className="grid grid-cols-2 rounded-[12px] border border-[#e5e7eb] p-2">
              <button
                type="button"
                className={
                  field.value === 'expense'
                    ? 'flex h-[46px] items-center justify-center gap-3 rounded-lg border border-[#dc2626] bg-[#f8f9fa] px-3 py-[14px] text-base font-medium leading-[18px] text-[#111827]'
                    : 'flex h-[46px] items-center justify-center gap-3 rounded-lg px-3 py-[14px] text-base font-normal leading-[18px] text-[#4b5563]'
                }
                onClick={() => field.onChange('expense')}
              >
                <CircleArrowDown className={field.value === 'expense' ? 'text-[#dc2626]' : 'text-[#9ca3af]'} size={16} />
                Despesa
              </button>
              <button
                type="button"
                className={
                  field.value === 'income'
                    ? 'flex h-[46px] items-center justify-center gap-3 rounded-lg border border-[#1f6f43] bg-[#f8f9fa] px-3 py-[14px] text-base font-medium leading-[18px] text-[#111827]'
                    : 'flex h-[46px] items-center justify-center gap-3 rounded-lg px-3 py-[14px] text-base font-normal leading-[18px] text-[#4b5563]'
                }
                onClick={() => field.onChange('income')}
              >
                <CircleArrowUp className={field.value === 'income' ? 'text-[#1f6f43]' : 'text-[#9ca3af]'} size={16} />
                Receita
              </button>
            </div>
          )}
        />

        <Field label="Descrição" error={errors.title?.message}>
          <Input hasError={Boolean(errors.title)} placeholder="Ex. Almoço no restaurante" {...register('title')} />
        </Field>

        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4">
          <Field label="Data" error={errors.date?.message}>
            <Input
              hasError={Boolean(errors.date)}
              placeholder="Selecione"
              type="date"
              {...register('date')}
            />
          </Field>

          <Field label="Valor" error={errors.amount?.message}>
            <Controller
              control={control}
              name="amount"
              render={({ field }) => (
                <div
                  className={
                    errors.amount
                      ? 'flex h-12 w-full min-w-0 items-center gap-3 rounded-lg border border-app-danger bg-white px-[13px] py-[15px]'
                      : 'flex h-12 w-full min-w-0 items-center gap-3 rounded-lg border border-[#d1d5db] bg-white px-[13px] py-[15px]'
                  }
                >
                  <span className="text-base leading-[18px] text-[#111827]">R$</span>
                  <input
                    inputMode="numeric"
                    className="min-w-0 flex-1 bg-transparent text-base leading-[18px] text-[#111827] outline-none placeholder:text-[#9ca3af]"
                    value={formatCurrencyMask(field.value)}
                    onBlur={field.onBlur}
                    onChange={(event) => field.onChange(parseCurrencyMask(event.target.value))}
                  />
                </div>
              )}
            />
          </Field>
        </div>

        <Field label="Categoria" error={errors.categoryId?.message}>
          <Select hasError={Boolean(errors.categoryId)} {...register('categoryId')}>
            <option value="">Selecione</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </Field>
      </form>
    </Dialog>
  )
}

function toDateInputValue(date: string) {
  if (!date) {
    return ''
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  return parsedDate.toISOString().slice(0, 10)
}

function formatCurrencyMask(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return '0,00'
  }

  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })
    .format(value)
    .replace(/\u00a0/g, ' ')
}

function parseCurrencyMask(value: string) {
  const cents = value.replace(/\D/g, '')

  if (!cents) {
    return 0
  }

  return Number(cents) / 100
}
