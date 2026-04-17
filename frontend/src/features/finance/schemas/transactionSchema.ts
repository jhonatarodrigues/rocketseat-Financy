import { z } from 'zod'

export const transactionSchema = z.object({
  title: z.string().min(2, 'Informe pelo menos 2 caracteres.'),
  amount: z.number().positive('Informe um valor maior que zero.'),
  type: z.enum(['income', 'expense']),
  date: z.string().min(1, 'Informe uma data.'),
  categoryId: z.string().min(1, 'Escolha uma categoria.'),
})

export type TransactionFormValues = z.infer<typeof transactionSchema>
