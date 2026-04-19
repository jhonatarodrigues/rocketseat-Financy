import { mockCategories } from '../mocks/financeMock'
import type { Category, CategoryInput } from '../types/finance'

const delay = <T,>(value: T) =>
  new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), 250)
  })

export const categoryRepository = {
  async list() {
    return delay<Category[]>(mockCategories)
  },

  async create(input: CategoryInput) {
    return delay<Category>({
      ...input,
      id: `cat-${crypto.randomUUID()}`,
      itemsCount: 0,
      tagClassName: getCategoryTone(input.color),
    })
  },

  async update(categoryId: string, input: CategoryInput) {
    return delay<Category>({
      ...input,
      id: categoryId,
      tagClassName: getCategoryTone(input.color),
    })
  },

  async delete(categoryId: string) {
    void categoryId
    return delay(true)
  },
}

function getCategoryTone(color: string) {
  const tones: Record<string, string> = {
    '#2563eb': 'bg-[#dbeafe] text-[#2563eb]',
    '#db2777': 'bg-[#fce7f3] text-[#db2777]',
    '#16a34a': 'bg-[#dcfce7] text-[#15803d]',
    '#15803d': 'bg-[#dcfce7] text-[#15803d]',
    '#9333ea': 'bg-[#f3e8ff] text-[#9333ea]',
    '#ea580c': 'bg-[#ffedd5] text-[#ea580c]',
    '#1f6f43': 'bg-[#dcfce7] text-[#15803d]',
    '#ef4444': 'bg-[#fee2e2] text-[#dc2626]',
    '#dc2626': 'bg-[#fee2e2] text-[#dc2626]',
    '#ca8a04': 'bg-[#fef9c3] text-[#a16207]',
    '#a16207': 'bg-[#fef9c3] text-[#a16207]',
  }

  return tones[color] ?? 'bg-[#e5e7eb] text-[#374151]'
}
