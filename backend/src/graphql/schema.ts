import { createSchema } from 'graphql-yoga';

import type { GraphQLContext } from './context.js';

export const schema = createSchema<GraphQLContext>({
  typeDefs: /* GraphQL */ `
    type Query {
      health: String!
    }

    type Mutation {
      _empty: String
    }
  `,
  resolvers: {
    Query: {
      health: () => 'ok',
    },
  },
});
