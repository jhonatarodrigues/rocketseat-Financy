import { z } from 'zod';

export const registerInputSchema = z.object({
  name: z.string().trim().min(2, 'Name must have at least 2 characters'),
  email: z.string().trim().email('Invalid email').toLowerCase(),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
});

export const loginInputSchema = z.object({
  email: z.string().trim().email('Invalid email').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileInputSchema = z.object({
  name: z.string().trim().min(2, 'Name must have at least 2 characters'),
});
