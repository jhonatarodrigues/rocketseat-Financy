import { createSchema } from 'graphql-yoga';

import type { GraphQLContext } from './context.js';
import { login, me, register, updateProfile } from '../modules/auth/auth.service.js';
import {
  categories,
  createCategory,
  deleteCategory,
  updateCategory,
} from '../modules/categories/category.service.js';
import {
  createTransaction,
  deleteTransaction,
  transactions,
  updateTransaction,
} from '../modules/transactions/transaction.service.js';

export const schema = createSchema<GraphQLContext>({
  typeDefs: /* GraphQL */ `
    type User {
      id: ID!
      name: String!
      email: String!
      avatarUrl: String
      createdAt: String!
      updatedAt: String!
    }

    type AuthPayload {
      token: String!
      user: User!
    }

    type Category {
      id: ID!
      name: String!
      title: String!
      description: String
      icon: String!
      color: String!
      createdAt: String!
      updatedAt: String!
    }

    type Transaction {
      id: ID!
      title: String!
      description: String!
      amount: Int!
      type: TransactionType!
      date: String!
      categoryId: ID!
      category: Category!
      createdAt: String!
      updatedAt: String!
    }

    enum TransactionType {
      EXPENSE
      INCOME
    }

    input RegisterInput {
      name: String!
      email: String!
      password: String!
    }

    input LoginInput {
      email: String!
      password: String!
    }

    input UpdateProfileInput {
      name: String!
      avatarUrl: String
    }

    input CreateCategoryInput {
      title: String!
      description: String
      icon: String!
      color: String!
    }

    input UpdateCategoryInput {
      id: ID!
      title: String
      description: String
      icon: String
      color: String
    }

    input DeleteCategoryInput {
      id: ID!
    }

    input CreateTransactionInput {
      description: String!
      amount: Int!
      type: TransactionType!
      date: String!
      categoryId: ID!
    }

    input UpdateTransactionInput {
      id: ID!
      description: String
      amount: Int
      type: TransactionType
      date: String
      categoryId: ID
    }

    input DeleteTransactionInput {
      id: ID!
    }

    type Query {
      health: String!
      me: User!
      categories: [Category!]!
      transactions: [Transaction!]!
    }

    type Mutation {
      register(input: RegisterInput!): AuthPayload!
      login(input: LoginInput!): AuthPayload!
      updateProfile(input: UpdateProfileInput!): User!
      createCategory(input: CreateCategoryInput!): Category!
      updateCategory(input: UpdateCategoryInput!): Category!
      deleteCategory(input: DeleteCategoryInput!): Boolean!
      createTransaction(input: CreateTransactionInput!): Transaction!
      updateTransaction(input: UpdateTransactionInput!): Transaction!
      deleteTransaction(input: DeleteTransactionInput!): Boolean!
    }
  `,
  resolvers: {
    Query: {
      health: () => 'ok',
      me,
      categories,
      transactions,
    },
    Mutation: {
      register,
      login,
      updateProfile,
      createCategory,
      updateCategory,
      deleteCategory,
      createTransaction,
      updateTransaction,
      deleteTransaction,
    },
  },
});
