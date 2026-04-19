import { graphqlRequest } from '../graphql/client'
import type { Category, CategoryInput } from '../types/finance'

export const categoryRepository = {
  async list() {
    const data = await graphqlRequest<{ categories: ApiCategory[] }>(
      /* GraphQL */ `
        query Categories {
          categories {
            id
            name
            title
            description
            icon
            color
          }
        }
      `,
    )

    return data.categories.map(mapCategory)
  },

  async create(input: CategoryInput) {
    const data = await graphqlRequest<
      { createCategory: ApiCategory },
      { input: CreateCategoryMutationInput }
    >(
      /* GraphQL */ `
        mutation CreateCategory($input: CreateCategoryInput!) {
          createCategory(input: $input) {
            id
            name
            title
            description
            icon
            color
          }
        }
      `,
      {
        input: mapCategoryInput(input),
      },
    )

    return mapCategory(data.createCategory)
  },

  async update(categoryId: string, input: CategoryInput) {
    const data = await graphqlRequest<
      { updateCategory: ApiCategory },
      { input: UpdateCategoryMutationInput }
    >(
      /* GraphQL */ `
        mutation UpdateCategory($input: UpdateCategoryInput!) {
          updateCategory(input: $input) {
            id
            name
            title
            description
            icon
            color
          }
        }
      `,
      {
        input: {
          id: categoryId,
          ...mapCategoryInput(input),
        },
      },
    )

    return mapCategory(data.updateCategory)
  },

  async delete(categoryId: string) {
    const data = await graphqlRequest<
      { deleteCategory: boolean },
      { input: { id: string } }
    >(
      /* GraphQL */ `
        mutation DeleteCategory($input: DeleteCategoryInput!) {
          deleteCategory(input: $input)
        }
      `,
      {
        input: {
          id: categoryId,
        },
      },
    )

    return data.deleteCategory
  },
}

type ApiCategory = {
  id: string
  name: string
  title: string
  description?: string | null
  icon: string
  color: string
}

type CreateCategoryMutationInput = {
  title: string
  description: string | null
  icon: string
  color: string
}

type UpdateCategoryMutationInput = CreateCategoryMutationInput & {
  id: string
}

function mapCategory(category: ApiCategory): Category {
  return {
    id: category.id,
    name: category.name || category.title,
    color: category.color,
    description: category.description ?? '',
    icon: category.icon,
    tagClassName: getCategoryTone(category.color),
  }
}

function mapCategoryInput(input: CategoryInput): CreateCategoryMutationInput {
  return {
    title: input.name,
    description: input.description || null,
    icon: input.icon,
    color: input.color,
  }
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
