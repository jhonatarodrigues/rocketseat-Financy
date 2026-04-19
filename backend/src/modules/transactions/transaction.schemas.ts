import { z } from 'zod';

const transactionTypeSchema = z.enum(['EXPENSE', 'INCOME'], {
  message: 'Type must be EXPENSE or INCOME',
});

export const createTransactionInputSchema = z.object({
  description: z.string().trim().min(1, 'Description is required'),
  amount: z.coerce.number().int().positive('Amount must be greater than zero'),
  type: transactionTypeSchema,
  date: z.string().datetime('Date must be an ISO date'),
  categoryId: z.string().trim().min(1, 'Category id is required'),
});

export const updateTransactionInputSchema = createTransactionInputSchema
  .partial()
  .extend({
    id: z.string().trim().min(1, 'Transaction id is required'),
  })
  .refine(
    ({ description, amount, type, date, categoryId }) =>
      description !== undefined ||
      amount !== undefined ||
      type !== undefined ||
      date !== undefined ||
      categoryId !== undefined,
    'At least one field must be provided',
  );

export const deleteTransactionInputSchema = z.object({
  id: z.string().trim().min(1, 'Transaction id is required'),
});
