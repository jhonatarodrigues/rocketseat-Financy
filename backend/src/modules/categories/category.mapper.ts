import type { Category } from '@prisma/client';

export function mapCategory(category: Category) {
  return {
    id: category.id,
    name: category.title,
    title: category.title,
    description: category.description,
    icon: category.icon,
    color: category.color,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}
