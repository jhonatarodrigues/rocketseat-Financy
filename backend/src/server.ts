import { createServer } from 'node:http';

import { createYoga } from 'graphql-yoga';

import { env } from './config/env.js';
import type { GraphQLContext } from './graphql/context.js';
import { schema } from './graphql/schema.js';
import { prisma } from './lib/prisma.js';

const yoga = createYoga<GraphQLContext>({
  schema,
  cors: {
    origin: env.FRONTEND_URL,
    credentials: true,
  },
  context: () => ({
    prisma,
  }),
});

const server = createServer(yoga);

server.listen(env.PORT, () => {
  console.log(`GraphQL server running at http://localhost:${env.PORT}/graphql`);
});
