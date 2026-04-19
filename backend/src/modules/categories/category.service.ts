import type { GraphQLContext } from '../../graphql/context.js';
import { badRequest, notFound, parseInput, requireUserId } from '../shared/errors.js';
import { mapCategory } from './category.mapper.js';
import {
  createCategoryInputSchema,
  deleteCategoryInputSchema,
  updateCategoryInputSchema,
} from './category.schemas.js';

export async function categories(_: unknown, __: unknown, context: GraphQLContext) {
  const userId = requireUserId(context.userId);

  const userCategories = await context.prisma.category.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return userCategories.map(mapCategory);
}

export async function createCategory(
  _: unknown,
  args: { input: unknown },
  context: GraphQLContext,
) {
  const userId = requireUserId(context.userId);
  const input = parseInput(createCategoryInputSchema.safeParse(args.input));

  const category = await context.prisma.category.create({
    data: {
      title: input.title,
      description: input.description || null,
      icon: input.icon,
      color: input.color,
      userId,
    },
  });

  return mapCategory(category);
}

export async function updateCategory(
  _: unknown,
  args: { input: unknown },
  context: GraphQLContext,
) {
  const userId = requireUserId(context.userId);
  const input = parseInput(updateCategoryInputSchema.safeParse(args.input));

  const currentCategory = await context.prisma.category.findFirst({
    where: {
      id: input.id,
      userId,
    },
  });

  if (!currentCategory) {
    throw notFound('Category not found');
  }

  const category = await context.prisma.category.update({
    where: {
      id: input.id,
    },
    data: {
      title: input.title,
      description: input.description === undefined ? undefined : input.description || null,
      icon: input.icon,
      color: input.color,
    },
  });

  return mapCategory(category);
}

export async function deleteCategory(
  _: unknown,
  args: { input: unknown },
  context: GraphQLContext,
) {
  const userId = requireUserId(context.userId);
  const input = parseInput(deleteCategoryInputSchema.safeParse(args.input));

  const currentCategory = await context.prisma.category.findFirst({
    where: {
      id: input.id,
      userId,
    },
  });

  if (!currentCategory) {
    throw notFound('Category not found');
  }

  const transactionsCount = await context.prisma.transaction.count({
    where: {
      categoryId: input.id,
      userId,
    },
  });

  if (transactionsCount > 0) {
    throw badRequest('Category has transactions and cannot be deleted');
  }

  await context.prisma.category.delete({
    where: {
      id: input.id,
    },
  });

  return true;
}
