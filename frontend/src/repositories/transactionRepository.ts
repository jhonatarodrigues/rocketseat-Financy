import { graphqlRequest } from '../graphql/client'
import type { Transaction, TransactionInput } from '../types/finance'

export const transactionRepository = {
  async list() {
    const data = await graphqlRequest<{ transactions: ApiTransaction[] }>(
      /* GraphQL */ `
        query Transactions {
          transactions {
            id
            title
            description
            amount
            type
            date
            categoryId
            category {
              icon
            }
          }
        }
      `,
    )

    return data.transactions.map(mapTransaction)
  },

  async create(input: TransactionInput) {
    const data = await graphqlRequest<
      { createTransaction: ApiTransaction },
      { input: CreateTransactionMutationInput }
    >(
      /* GraphQL */ `
        mutation CreateTransaction($input: CreateTransactionInput!) {
          createTransaction(input: $input) {
            id
            title
            description
            amount
            type
            date
            categoryId
            category {
              icon
            }
          }
        }
      `,
      {
        input: mapTransactionInput(input),
      },
    )

    return mapTransaction(data.createTransaction)
  },

  async update(transactionId: string, input: TransactionInput) {
    const data = await graphqlRequest<
      { updateTransaction: ApiTransaction },
      { input: UpdateTransactionMutationInput }
    >(
      /* GraphQL */ `
        mutation UpdateTransaction($input: UpdateTransactionInput!) {
          updateTransaction(input: $input) {
            id
            title
            description
            amount
            type
            date
            categoryId
            category {
              icon
            }
          }
        }
      `,
      {
        input: {
          id: transactionId,
          ...mapTransactionInput(input),
        },
      },
    )

    return mapTransaction(data.updateTransaction)
  },

  async delete(transactionId: string) {
    const data = await graphqlRequest<
      { deleteTransaction: boolean },
      { input: { id: string } }
    >(
      /* GraphQL */ `
        mutation DeleteTransaction($input: DeleteTransactionInput!) {
          deleteTransaction(input: $input)
        }
      `,
      {
        input: {
          id: transactionId,
        },
      },
    )

    return data.deleteTransaction
  },
}

type ApiTransaction = {
  id: string
  title: string
  description: string
  amount: number
  type: 'EXPENSE' | 'INCOME'
  date: string
  categoryId: string
  category?: {
    icon?: string | null
  } | null
}

type CreateTransactionMutationInput = {
  description: string
  amount: number
  type: 'EXPENSE' | 'INCOME'
  date: string
  categoryId: string
}

type UpdateTransactionMutationInput = CreateTransactionMutationInput & {
  id: string
}

function mapTransaction(transaction: ApiTransaction): Transaction {
  return {
    id: transaction.id,
    title: transaction.title || transaction.description,
    amount: transaction.amount / 100,
    type: transaction.type === 'INCOME' ? 'income' : 'expense',
    date: transaction.date,
    categoryId: transaction.categoryId,
    icon: transaction.category?.icon ?? undefined,
  }
}

function mapTransactionInput(input: TransactionInput): CreateTransactionMutationInput {
  return {
    description: input.title,
    amount: Math.round(input.amount * 100),
    type: input.type === 'income' ? 'INCOME' : 'EXPENSE',
    date: input.date,
    categoryId: input.categoryId,
  }
}
