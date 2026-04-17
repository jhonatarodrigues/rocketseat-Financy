import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { categorySchema, type CategoryFormValues } from '../../features/finance/schemas/categorySchema'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { Field, Input } from '../ui/Field'
import type { Category, CategoryInput } from '../../types/finance'

type CategoryDialogProps = {
  category?: Category | null
  onClose: () => void
  onSubmit: (input: CategoryInput) => void
}

const initialForm: CategoryInput = {
  name: '',
  color: '#7c3aed',
}

export function CategoryDialog({ category, onClose, onSubmit }: CategoryDialogProps) {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: category ? { name: category.name, color: category.color } : initialForm,
  })

  function submitForm(values: CategoryInput) {
    onSubmit(values)
    onClose()
  }

  return (
    <Dialog
      title={category ? 'Editar categoria' : 'Nova categoria'}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="category-form" disabled={isSubmitting}>
            Salvar categoria
          </Button>
        </>
      }
    >
      <form id="category-form" className="grid gap-4" onSubmit={handleSubmit(submitForm)}>
        <Field label="Nome" error={errors.name?.message}>
          <Input hasError={Boolean(errors.name)} placeholder="Ex: Alimentacao" {...register('name')} />
        </Field>

        <Field label="Cor" error={errors.color?.message}>
          <Input type="color" hasError={Boolean(errors.color)} {...register('color')} />
        </Field>
      </form>
    </Dialog>
  )
}
