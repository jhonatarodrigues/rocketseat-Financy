export type User = {
  id: string
  name: string
  email: string
}

export type Category = {
  id: string
  name: string
  color: string
}

export type TransactionType = 'income' | 'expense'

export type Transaction = {
  id: string
  title: string
  amount: number
  type: TransactionType
  date: string
  categoryId: string
}

export type LoginInput = {
  email: string
  password: string
}

export type RegisterInput = {
  name: string
  email: string
  password: string
}

export type TransactionInput = {
  title: string
  amount: number
  type: TransactionType
  date: string
  categoryId: string
}

export type CategoryInput = {
  name: string
  color: string
}
