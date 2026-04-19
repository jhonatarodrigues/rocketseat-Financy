import { z } from 'zod';

export const createCategoryInputSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().optional().nullable(),
  icon: z.string().trim().min(1, 'Icon is required'),
  color: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, 'Color must be a hex value'),
});

export const updateCategoryInputSchema = createCategoryInputSchema
  .partial()
  .extend({
    id: z.string().trim().min(1, 'Category id is required'),
  })
  .refine(
    ({ title, description, icon, color }) =>
      title !== undefined ||
      description !== undefined ||
      icon !== undefined ||
      color !== undefined,
    'At least one field must be provided',
  );

export const deleteCategoryInputSchema = z.object({
  id: z.string().trim().min(1, 'Category id is required'),
});
