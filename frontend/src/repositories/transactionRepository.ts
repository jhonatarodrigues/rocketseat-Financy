import { mockTransactions } from '../mocks/financeMock'
import type { Transaction, TransactionInput } from '../types/finance'

const delay = <T,>(value: T) =>
  new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), 250)
  })

export const transactionRepository = {
  async list() {
    return delay<Transaction[]>(mockTransactions)
  },

  async create(input: TransactionInput) {
    return delay<Transaction>({
      ...input,
      id: `tr-${crypto.randomUUID()}`,
    })
  },

  async update(transactionId: string, input: TransactionInput) {
    return delay<Transaction>({
      ...input,
      id: transactionId,
    })
  },

  async delete(transactionId: string) {
    void transactionId
    return delay(true)
  },
}
