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
  categories: (userId: string) => ['categories', userId] as const,
  transactions: (userId: string) => ['transactions', userId] as const,
}

const emptyCategories: Category[] = []
const emptyTransactions: Transaction[] = []

export function useFinance(userId: string) {
  const queryClient = useQueryClient()
  const categoriesQueryKey = financeQueryKeys.categories(userId)
  const transactionsQueryKey = financeQueryKeys.transactions(userId)

  const categoriesQuery = useQuery({
    queryKey: categoriesQueryKey,
    queryFn: categoryRepository.list,
  })

  const transactionsQuery = useQuery({
    queryKey: transactionsQueryKey,
    queryFn: transactionRepository.list,
  })

  const storedCategories = categoriesQuery.data ?? emptyCategories
  const transactions = transactionsQuery.data ?? emptyTransactions

  const categories = useMemo(() => {
    return storedCategories.map((category) => {
      const categoryTransactions = transactions.filter(
        (transaction) => transaction.categoryId === category.id,
      )
      const amount = categoryTransactions.reduce(
        (total, transaction) => total + transaction.amount,
        0,
      )

      return {
        ...category,
        amount,
        itemsCount: categoryTransactions.length,
      }
    })
  }, [storedCategories, transactions])

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
      queryClient.setQueryData<Transaction[]>(transactionsQueryKey, (current = []) => [
        transaction,
        ...current,
      ])
    },
  })

  const updateTransactionMutation = useMutation({
    mutationFn: ({ transactionId, input }: { transactionId: string; input: TransactionInput }) =>
      transactionRepository.update(transactionId, input),
    onSuccess(updatedTransaction) {
      queryClient.setQueryData<Transaction[]>(transactionsQueryKey, (current = []) =>
        current.map((transaction) =>
          transaction.id === updatedTransaction.id ? updatedTransaction : transaction,
        ),
      )
    },
  })

  const deleteTransactionMutation = useMutation({
    mutationFn: transactionRepository.delete,
    onSuccess(_response, transactionId) {
      queryClient.setQueryData<Transaction[]>(transactionsQueryKey, (current = []) =>
        current.filter((transaction) => transaction.id !== transactionId),
      )
    },
  })

  const createCategoryMutation = useMutation({
    mutationFn: categoryRepository.create,
    onSuccess(category) {
      queryClient.setQueryData<Category[]>(categoriesQueryKey, (current = []) => [
        category,
        ...current,
      ])
    },
  })

  const updateCategoryMutation = useMutation({
    mutationFn: ({ categoryId, input }: { categoryId: string; input: CategoryInput }) =>
      categoryRepository.update(categoryId, input),
    onSuccess(updatedCategory) {
      queryClient.setQueryData<Category[]>(categoriesQueryKey, (current = []) =>
        current.map((category) =>
          category.id === updatedCategory.id ? { ...category, ...updatedCategory } : category,
        ),
      )
    },
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: categoryRepository.delete,
    onSuccess(_response, categoryId) {
      queryClient.setQueryData<Category[]>(categoriesQueryKey, (current = []) =>
        current.filter((category) => category.id !== categoryId),
      )

      queryClient.setQueryData<Transaction[]>(transactionsQueryKey, (current = []) =>
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
