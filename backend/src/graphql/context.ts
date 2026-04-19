import type { PrismaClient } from '@prisma/client';
import type { YogaInitialContext } from 'graphql-yoga';

export type GraphQLContext = YogaInitialContext & {
  prisma: PrismaClient;
};
