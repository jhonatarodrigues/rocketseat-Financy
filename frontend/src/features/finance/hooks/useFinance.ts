import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { categoryRepository } from '../../../repositories/categoryRepository'
import { transactionRepository } from '../../../repositories/transactionRepository'
import type {
  Category,
  CategoryInput,
  Transaction,
  TransactionInput,
} from '../../../types/finance'

const financeQueryKeys = {
  categories: ['categories'] as const,
  transactions: ['transactions'] as const,
}

const emptyCategories: Category[] = []
const emptyTransactions: Transaction[] = []

export function useFinance() {
  const queryClient = useQueryClient()

  const categoriesQuery = useQuery({
    queryKey: financeQueryKeys.categories,
    queryFn: categoryRepository.list,
  })

  const transactionsQuery = useQuery({
    queryKey: financeQueryKeys.transactions,
    queryFn: transactionRepository.list,
  })

  const categories = categoriesQuery.data ?? emptyCategories
  const transactions = transactionsQuery.data ?? emptyTransactions

  const summary = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0)

    const expense = transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0)

    return {
      income,
      expense,
      balance: income - expense,
    }
  }, [transactions])

  const createTransactionMutation = useMutation({
    mutationFn: transactionRepository.create,
    onSuccess(transaction) {
      queryClient.setQueryData<Transaction[]>(financeQueryKeys.transactions, (current = []) => [
        transaction,
        ...current,
      ])
    },
  })

  const updateTransactionMutation = useMutation({
    mutationFn: ({ transactionId, input }: { transactionId: string; input: TransactionInput }) =>
      transactionRepository.update(transactionId, input),
    onSuccess(updatedTransaction) {
      queryClient.setQueryData<Transaction[]>(financeQueryKeys.transactions, (current = []) =>
        current.map((transaction) =>
          transaction.id === updatedTransaction.id ? updatedTransaction : transaction,
        ),
      )
    },
  })

  const deleteTransactionMutation = useMutation({
    mutationFn: transactionRepository.delete,
    onSuccess(_response, transactionId) {
      queryClient.setQueryData<Transaction[]>(financeQueryKeys.transactions, (current = []) =>
        current.filter((transaction) => transaction.id !== transactionId),
      )
    },
  })

  const createCategoryMutation = useMutation({
    mutationFn: categoryRepository.create,
    onSuccess(category) {
      queryClient.setQueryData<Category[]>(financeQueryKeys.categories, (current = []) => [
        category,
        ...current,
      ])
    },
  })

  const updateCategoryMutation = useMutation({
    mutationFn: ({ categoryId, input }: { categoryId: string; input: CategoryInput }) =>
      categoryRepository.update(categoryId, input),
    onSuccess(updatedCategory) {
      queryClient.setQueryData<Category[]>(financeQueryKeys.categories, (current = []) =>
        current.map((category) =>
          category.id === updatedCategory.id ? { ...category, ...updatedCategory } : category,
        ),
      )
    },
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: categoryRepository.delete,
    onSuccess(_response, categoryId) {
      queryClient.setQueryData<Category[]>(financeQueryKeys.categories, (current = []) =>
        current.filter((category) => category.id !== categoryId),
      )

      queryClient.setQueryData<Transaction[]>(financeQueryKeys.transactions, (current = []) =>
        current.filter((transaction) => transaction.categoryId !== categoryId),
      )
    },
  })

  return {
    categories,
    transactions,
    summary,
    isLoading: categoriesQuery.isLoading || transactionsQuery.isLoading,
    createTransaction: createTransactionMutation.mutate,
    updateTransaction: (transactionId: string, input: TransactionInput) =>
      updateTransactionMutation.mutate({ transactionId, input }),
    deleteTransaction: deleteTransactionMutation.mutate,
    createCategory: createCategoryMutation.mutate,
    updateCategory: (categoryId: string, input: CategoryInput) =>
      updateCategoryMutation.mutate({ categoryId, input }),
    deleteCategory: deleteCategoryMutation.mutate,
  }
}
