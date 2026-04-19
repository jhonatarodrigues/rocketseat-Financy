import type { GraphQLContext } from '../../graphql/context.js';
import { notFound, parseInput, requireUserId } from '../shared/errors.js';
import { mapTransaction } from './transaction.mapper.js';
import {
  createTransactionInputSchema,
  deleteTransactionInputSchema,
  updateTransactionInputSchema,
} from './transaction.schemas.js';

async function ensureCategoryBelongsToUser(
  context: GraphQLContext,
  categoryId: string,
  userId: string,
) {
  const category = await context.prisma.category.findFirst({
    where: {
      id: categoryId,
      userId,
    },
  });

  if (!category) {
    throw notFound('Category not found');
  }

  return category;
}

export async function transactions(_: unknown, __: unknown, context: GraphQLContext) {
  const userId = requireUserId(context.userId);

  const userTransactions = await context.prisma.transaction.findMany({
    where: {
      userId,
    },
    include: {
      category: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  return userTransactions.map(mapTransaction);
}

export async function createTransaction(
  _: unknown,
  args: { input: unknown },
  context: GraphQLContext,
) {
  const userId = requireUserId(context.userId);
  const input = parseInput(createTransactionInputSchema.safeParse(args.input));

  await ensureCategoryBelongsToUser(context, input.categoryId, userId);

  const transaction = await context.prisma.transaction.create({
    data: {
      description: input.description,
      amount: input.amount,
      type: input.type,
      date: new Date(input.date),
      categoryId: input.categoryId,
      userId,
    },
    include: {
      category: true,
    },
  });

  return mapTransaction(transaction);
}

export async function updateTransaction(
  _: unknown,
  args: { input: unknown },
  context: GraphQLContext,
) {
  const userId = requireUserId(context.userId);
  const input = parseInput(updateTransactionInputSchema.safeParse(args.input));

  const currentTransaction = await context.prisma.transaction.findFirst({
    where: {
      id: input.id,
      userId,
    },
  });

  if (!currentTransaction) {
    throw notFound('Transaction not found');
  }

  if (input.categoryId) {
    await ensureCategoryBelongsToUser(context, input.categoryId, userId);
  }

  const transaction = await context.prisma.transaction.update({
    where: {
      id: input.id,
    },
    data: {
      description: input.description,
      amount: input.amount,
      type: input.type,
      date: input.date ? new Date(input.date) : undefined,
      categoryId: input.categoryId,
    },
    include: {
      category: true,
    },
  });

  return mapTransaction(transaction);
}

export async function deleteTransaction(
  _: unknown,
  args: { input: unknown },
  context: GraphQLContext,
) {
  const userId = requireUserId(context.userId);
  const input = parseInput(deleteTransactionInputSchema.safeParse(args.input));

  const currentTransaction = await context.prisma.transaction.findFirst({
    where: {
      id: input.id,
      userId,
    },
  });

  if (!currentTransaction) {
    throw notFound('Transaction not found');
  }

  await context.prisma.transaction.delete({
    where: {
      id: input.id,
    },
  });

  return true;
}
