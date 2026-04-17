import type { Category, Transaction, User } from '../types/finance'

export const mockUser: User = {
  id: 'user-1',
  name: 'Jhonata Rodrigues',
  email: 'jhonata@email.com',
}

export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Moradia', color: '#7c3aed' },
  { id: 'cat-2', name: 'Alimentacao', color: '#0891b2' },
  { id: 'cat-3', name: 'Transporte', color: '#ea580c' },
  { id: 'cat-4', name: 'Receitas', color: '#16a34a' },
]

export const mockTransactions: Transaction[] = [
  {
    id: 'tr-1',
    title: 'Salario',
    amount: 6800,
    type: 'income',
    date: '2026-04-05',
    categoryId: 'cat-4',
  },
  {
    id: 'tr-2',
    title: 'Aluguel',
    amount: 1850,
    type: 'expense',
    date: '2026-04-07',
    categoryId: 'cat-1',
  },
  {
    id: 'tr-3',
    title: 'Mercado',
    amount: 436.9,
    type: 'expense',
    date: '2026-04-10',
    categoryId: 'cat-2',
  },
  {
    id: 'tr-4',
    title: 'Aplicativo de transporte',
    amount: 72.4,
    type: 'expense',
    date: '2026-04-12',
    categoryId: 'cat-3',
  },
]
