import type { Category, Transaction } from '@prisma/client';

import { mapCategory } from '../categories/category.mapper.js';

type TransactionWithCategory = Transaction & {
  category: Category;
};

export function mapTransaction(transaction: TransactionWithCategory) {
  return {
    id: transaction.id,
    description: transaction.description,
    amount: transaction.amount,
    type: transaction.type,
    date: transaction.date.toISOString(),
    category: mapCategory(transaction.category),
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString(),
  };
}
