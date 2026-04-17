import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Informe um email valido.'),
  password: z.string().min(6, 'Informe pelo menos 6 caracteres.'),
})

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Informe pelo menos 2 caracteres.'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
