import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
        <Field label="Título" error={errors.title?.message}>
          <Input hasError={Boolean(errors.title)} placeholder="Ex: Mercado" {...register('title')} />
        </Field>

        <Field label="Valor" error={errors.amount?.message}>
          <Input
            min="0"
            step="0.01"
            type="number"
            hasError={Boolean(errors.amount)}
            {...register('amount', { valueAsNumber: true })}
          />
        </Field>

        <Field label="Tipo" error={errors.type?.message}>
          <Select hasError={Boolean(errors.type)} {...register('type')}>
            <option value="expense">Saída</option>
            <option value="income">Entrada</option>
          </Select>
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
