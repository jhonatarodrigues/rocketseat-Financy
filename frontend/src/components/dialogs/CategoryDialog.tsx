import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import {
  BriefcaseBusiness,
  CalendarDays,
  CarFront,
  Check,
  HeartPulse,
  PiggyBank,
  ShoppingCart,
  Tag,
  Ticket,
  ToolCase,
  Utensils,
} from 'lucide-react'
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
  description: '',
  icon: 'tag',
}

const categoryColors = ['#2563eb', '#db2777', '#15803d', '#ea580c', '#1f6f43', '#dc2626', '#9333ea', '#a16207']

const categoryIcons = [
  { icon: Utensils, label: 'Alimentação', value: 'utensils' },
  { icon: Ticket, label: 'Lazer', value: 'ticket' },
  { icon: PiggyBank, label: 'Investimento', value: 'piggy-bank' },
  { icon: ShoppingCart, label: 'Mercado', value: 'shopping-cart' },
  { icon: BriefcaseBusiness, label: 'Trabalho', value: 'briefcase' },
  { icon: HeartPulse, label: 'Saúde', value: 'heart-pulse' },
  { icon: CarFront, label: 'Transporte', value: 'car' },
  { icon: CalendarDays, label: 'Utilidades', value: 'calendar' },
  { icon: ToolCase, label: 'Serviços', value: 'tool-case' },
  { icon: Tag, label: 'Geral', value: 'tag' },
]

export function CategoryDialog({ category, onClose, onSubmit }: CategoryDialogProps) {
  const {
    formState: { errors, isSubmitting },
    control,
    handleSubmit,
    register,
    setValue,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
        name: category.name,
        color: category.color,
        description: category.description ?? '',
        icon: category.icon ?? 'tag',
      }
      : initialForm,
  })
  const selectedColor = useWatch({ control, name: 'color' })
  const selectedIcon = useWatch({ control, name: 'icon' })

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

        <Field label="Descrição" error={errors.description?.message}>
          <textarea
            className="min-h-20 w-full resize-none rounded-lg border border-[#d1d5db] bg-white px-[13px] py-[15px] text-base leading-6 text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-app-primary focus:ring-4 focus:ring-app-primary-soft"
            placeholder="Ex: Restaurantes, delivery e refeições"
            {...register('description')}
          />
        </Field>

        <Field label="Ícone" error={errors.icon?.message}>
          <input type="hidden" {...register('icon')} />
          <div className="grid grid-cols-5 gap-2">
            {categoryIcons.map((option) => {
              const Icon = option.icon
              const isActive = selectedIcon === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  className={
                    isActive
                      ? 'grid h-12 place-items-center rounded-lg border border-[#1f6f43] bg-[#dcfce7] text-[#15803d]'
                      : 'grid h-12 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[#4b5563]'
                  }
                  onClick={() => setValue('icon', option.value, { shouldDirty: true, shouldValidate: true })}
                  aria-label={`Selecionar icone ${option.label}`}
                  title={option.label}
                >
                  <Icon size={18} />
                </button>
              )
            })}
          </div>
        </Field>

        <Field label="Cor" error={errors.color?.message}>
          <input type="hidden" {...register('color')} />
          <div className="grid h-12 grid-cols-8 overflow-hidden rounded-lg border border-[#d1d5db] bg-white">
            {categoryColors.map((color) => (
              <button
                key={color}
                type="button"
                className="grid h-full place-items-center"
                style={{ backgroundColor: color }}
                onClick={() => setValue('color', color, { shouldDirty: true, shouldValidate: true })}
                aria-label={`Selecionar cor ${color}`}
              >
                {selectedColor === color ? <Check className="text-white drop-shadow-sm" size={16} /> : null}
              </button>
            ))}
          </div>
        </Field>
      </form>
    </Dialog>
  )
}
