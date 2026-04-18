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
  onSubmit: (input: TransactionInput) => void
}

const today = new Date().toISOString().slice(0, 10)

const initialForm: TransactionInput = {
  title: '',
  amount: 0,
  type: 'expense',
  date: today,
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
        date: transaction.date,
        categoryId: transaction.categoryId,
      }
      : {
        ...initialForm,
        categoryId: categories[0]?.id || '',
      },
  })

  function submitForm(values: TransactionInput) {
    onSubmit(values)
    onClose()
  }

  return (
    <Dialog
      title={transaction ? 'Editar transação' : 'Nova transação'}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="transaction-form" disabled={isSubmitting}>
            Salvar transação
          </Button>
        </>
      }
    >
      <form id="transaction-form" className="grid gap-4" onSubmit={handleSubmit(submitForm)}>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={
                  field.value === 'expense'
                    ? 'flex h-12 items-center justify-center gap-2 rounded-lg border border-[#ef4444] bg-[#fee2e2] text-base font-medium text-[#dc2626]'
                    : 'flex h-12 items-center justify-center gap-2 rounded-lg border border-[#d1d5db] bg-white text-base font-medium text-[#374151]'
                }
                onClick={() => field.onChange('expense')}
              >
                <CircleArrowDown size={18} />
                Despesa
              </button>
              <button
                type="button"
                className={
                  field.value === 'income'
                    ? 'flex h-12 items-center justify-center gap-2 rounded-lg border border-[#16a34a] bg-[#dcfce7] text-base font-medium text-[#15803d]'
                    : 'flex h-12 items-center justify-center gap-2 rounded-lg border border-[#d1d5db] bg-white text-base font-medium text-[#374151]'
                }
                onClick={() => field.onChange('income')}
              >
                <CircleArrowUp size={18} />
                Receita
              </button>
            </div>
          )}
        />

        <Field label="Título" error={errors.title?.message}>
          <Input hasError={Boolean(errors.title)} placeholder="Ex: Mercado" {...register('title')} />
        </Field>

        <Field label="Valor" error={errors.amount?.message}>
          <Controller
            control={control}
            name="amount"
            render={({ field }) => (
              <Input
                inputMode="numeric"
                hasError={Boolean(errors.amount)}
                placeholder="R$ 0,00"
                value={formatCurrencyMask(field.value)}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(parseCurrencyMask(event.target.value))}
              />
            )}
          />
        </Field>

        <Field label="Categoria" error={errors.categoryId?.message}>
          <Select hasError={Boolean(errors.categoryId)} {...register('categoryId')}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Data" error={errors.date?.message}>
          <Input type="date" hasError={Boolean(errors.date)} {...register('date')} />
        </Field>
      </form>
    </Dialog>
  )
}

function formatCurrencyMask(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return ''
  }

  return new Intl.NumberFormat('pt-BR', {
    currency: 'BRL',
    style: 'currency',
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
