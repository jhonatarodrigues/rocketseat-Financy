import { createSchema } from 'graphql-yoga';

import type { GraphQLContext } from './context.js';
import { login, me, register } from '../modules/auth/auth.service.js';

export const schema = createSchema<GraphQLContext>({
  typeDefs: /* GraphQL */ `
    type User {
      id: ID!
      name: String!
      email: String!
      createdAt: String!
      updatedAt: String!
    }

    type AuthPayload {
      token: String!
      user: User!
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

    type Query {
      health: String!
      me: User!
    }

    type Mutation {
      register(input: RegisterInput!): AuthPayload!
      login(input: LoginInput!): AuthPayload!
    }
  `,
  resolvers: {
    Query: {
      health: () => 'ok',
      me,
    },
    Mutation: {
      register,
      login,
    },
  },
});
