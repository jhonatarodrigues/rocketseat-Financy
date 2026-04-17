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
    })
  },

  async update(categoryId: string, input: CategoryInput) {
    return delay<Category>({
      ...input,
      id: categoryId,
    })
  },

  async delete(categoryId: string) {
    void categoryId
    return delay(true)
  },
}
