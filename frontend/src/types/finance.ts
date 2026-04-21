export type User = {
  id: string
  name: string
  email: string
}

export type Category = {
  id: string
  name: string
  color: string
  amount?: number
  description?: string
  icon?: string
  itemsCount?: number
  tagClassName?: string
}

export type TransactionType = 'income' | 'expense'

export type Transaction = {
  id: string
  title: string
  amount: number
  type: TransactionType
  date: string
  categoryId: string
  icon?: string
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

export type UpdateProfileInput = {
  name: string
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
  description: string
  icon: string
}
