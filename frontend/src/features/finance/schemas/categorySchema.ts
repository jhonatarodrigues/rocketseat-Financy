import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(2, 'Informe pelo menos 2 caracteres.'),
  description: z.string().min(3, 'Informe uma descrição.'),
  icon: z.string().min(1, 'Escolha um ícone.'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Escolha uma cor válida.'),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
