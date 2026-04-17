import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(2, 'Informe pelo menos 2 caracteres.'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Escolha uma cor valida.'),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
