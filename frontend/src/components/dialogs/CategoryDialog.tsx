import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import {
  BaggageClaim,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Check,
  Dumbbell,
  Gift,
  HeartPulse,
  House,
  Mailbox,
  PawPrint,
  PiggyBank,
  ReceiptText,
  ShoppingCart,
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
  color: '#16a34a',
  description: '',
  icon: 'briefcase',
}

const categoryColors = ['#16a34a', '#2563eb', '#9333ea', '#db2777', '#dc2626', '#ea580c', '#ca8a04']

const categoryIcons = [
  { icon: BriefcaseBusiness, label: 'Salário', value: 'briefcase' },
  { icon: CarFront, label: 'Transporte', value: 'car' },
  { icon: HeartPulse, label: 'Saúde', value: 'heart-pulse' },
  { icon: PiggyBank, label: 'Investimento', value: 'piggy-bank' },
  { icon: ShoppingCart, label: 'Mercado', value: 'shopping-cart' },
  { icon: Ticket, label: 'Entretenimento', value: 'ticket' },
  { icon: ToolCase, label: 'Utilidades', value: 'tool-case' },
  { icon: Utensils, label: 'Alimentação', value: 'utensils' },
  { icon: PawPrint, label: 'Pets', value: 'paw-print' },
  { icon: House, label: 'Moradia', value: 'house' },
  { icon: Gift, label: 'Presentes', value: 'gift' },
  { icon: Dumbbell, label: 'Academia', value: 'dumbbell' },
  { icon: BookOpen, label: 'Educação', value: 'book-open' },
  { icon: BaggageClaim, label: 'Viagens', value: 'baggage-claim' },
  { icon: Mailbox, label: 'Correspondência', value: 'mailbox' },
  { icon: ReceiptText, label: 'Contas', value: 'receipt-text' },
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
        icon: category.icon ?? 'briefcase',
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
      description="Organize suas transações com categorias"
      title={category ? 'Editar categoria' : 'Nova categoria'}
      onClose={onClose}
      panelClassName="max-w-[448px] rounded-[12px] p-[25px]"
      headerClassName="mb-6"
      titleClassName="text-base font-semibold leading-6"
      footerClassName="mt-6"
      footer={
        <Button type="submit" form="category-form" size="lg" className="h-12 w-full" disabled={isSubmitting}>
          Salvar
        </Button>
      }
    >
      <form id="category-form" className="grid gap-4" onSubmit={handleSubmit(submitForm)}>
        <Field label="Nome" error={errors.name?.message}>
          <Input hasError={Boolean(errors.name)} placeholder="Ex. Alimentação" {...register('name')} />
        </Field>

        <Field label="Descrição" error={errors.description?.message}>
          <textarea
            className="h-12 w-full resize-none rounded-lg border border-[#d1d5db] bg-white px-[13px] py-[15px] text-base leading-[18px] text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-app-primary focus:ring-4 focus:ring-app-primary-soft"
            placeholder="Descrição da categoria"
            {...register('description')}
          />
          <span className="-mt-1 text-xs leading-4 text-[#6b7280]">Opcional</span>
        </Field>

        <Field label="Ícone" error={errors.icon?.message}>
          <input type="hidden" {...register('icon')} />
          <div className="flex flex-wrap gap-2">
            {categoryIcons.map((option) => {
              const Icon = option.icon
              const isActive = selectedIcon === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  className={
                    isActive
                      ? 'grid h-[42px] w-[42px] place-items-center rounded-lg border border-[#1f6f43] bg-[#f8f9fa] text-[#4b5563]'
                      : 'grid h-[42px] w-[42px] place-items-center rounded-lg border border-[#d1d5db] bg-white text-[#4b5563]'
                  }
                  onClick={() => setValue('icon', option.value, { shouldDirty: true, shouldValidate: true })}
                  aria-label={`Selecionar ícone ${option.label}`}
                  title={option.label}
                >
                  <Icon size={20} strokeWidth={2} />
                </button>
              )
            })}
          </div>
        </Field>

        <Field label="Cor" error={errors.color?.message}>
          <input type="hidden" {...register('color')} />
          <div className="flex gap-2">
            {categoryColors.map((color) => (
              <button
                key={color}
                type="button"
                className={
                  selectedColor === color
                    ? 'flex h-[30px] flex-1 items-center justify-center rounded-lg border border-[#1f6f43] bg-[#f8f9fa] p-[5px]'
                    : 'flex h-[30px] flex-1 items-center justify-center rounded-lg border border-[#d1d5db] bg-white p-[5px]'
                }
                onClick={() => setValue('color', color, { shouldDirty: true, shouldValidate: true })}
                aria-label={`Selecionar cor ${color}`}
              >
                <span className="grid h-5 w-full place-items-center rounded" style={{ backgroundColor: color }}>
                  {selectedColor === color ? <Check className="text-white drop-shadow-sm" size={14} /> : null}
                </span>
              </button>
            ))}
          </div>
        </Field>
      </form>
    </Dialog>
  )
}
