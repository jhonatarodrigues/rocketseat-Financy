import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Informe um email valido.'),
  password: z.string().min(1, 'Informe sua senha.'),
})

export const registerSchema = z.object({
  email: z.string().email('Informe um email valido.'),
  name: z.string().min(2, 'Informe pelo menos 2 caracteres.'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
