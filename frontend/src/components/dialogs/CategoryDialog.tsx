import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { Check } from 'lucide-react'
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
  color: '#1f6f43',
}

const categoryColors = ['#1f6f43', '#2563eb', '#db2777', '#9333ea', '#ea580c', '#dc2626', '#a16207']

export function CategoryDialog({ category, onClose, onSubmit }: CategoryDialogProps) {
  const {
    formState: { errors, isSubmitting },
    control,
    handleSubmit,
    register,
    setValue,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: category ? { name: category.name, color: category.color } : initialForm,
  })
  const selectedColor = useWatch({ control, name: 'color' })

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
          <Input hasError={Boolean(errors.name)} placeholder="Ex: Alimentação" {...register('name')} />
        </Field>

        <Field label="Cor" error={errors.color?.message}>
          <input type="hidden" {...register('color')} />
          <div className="flex h-12 items-center gap-3 rounded-lg border border-[#d1d5db] bg-white px-[13px]">
            {categoryColors.map((color) => (
              <button
                key={color}
                type="button"
                className="grid h-8 w-8 place-items-center rounded-md border border-[#e5e7eb]"
                style={{ backgroundColor: color }}
                onClick={() => setValue('color', color, { shouldDirty: true, shouldValidate: true })}
                aria-label={`Selecionar cor ${color}`}
              >
                {selectedColor === color ? <Check className="text-white drop-shadow-sm" size={16} /> : null}
              </button>
            ))}
            <span className="ml-auto text-sm leading-5 text-[#4b5563]">{selectedColor}</span>
          </div>
        </Field>
      </form>
    </Dialog>
  )
}
