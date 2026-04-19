import { compare, hash } from 'bcryptjs';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';

import { env } from '../../config/env.js';
import type { GraphQLContext } from '../../graphql/context.js';
import { mapUser } from './auth.mapper.js';
import { loginInputSchema, registerInputSchema } from './auth.schemas.js';

type AuthUser = ReturnType<typeof mapUser>;

type AuthPayload = {
  token: string;
  user: AuthUser;
};

function createToken(userId: string) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

function unauthorized() {
  return new GraphQLError('Unauthorized', {
    extensions: {
      code: 'UNAUTHORIZED',
    },
  });
}

function badRequest(message: string) {
  return new GraphQLError(message, {
    extensions: {
      code: 'BAD_USER_INPUT',
    },
  });
}

function parseInput<T>(result: { success: true; data: T } | { success: false; error: { issues: { message: string }[] } }) {
  if (result.success) {
    return result.data;
  }

  throw badRequest(result.error.issues[0]?.message ?? 'Invalid input');
}

export async function register(
  _: unknown,
  args: { input: unknown },
  context: GraphQLContext,
): Promise<AuthPayload> {
  const input = parseInput(registerInputSchema.safeParse(args.input));

  const existingUser = await context.prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (existingUser) {
    throw badRequest('Email already registered');
  }

  const passwordHash = await hash(input.password, 10);

  const user = await context.prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
    },
  });

  return {
    token: createToken(user.id),
    user: mapUser(user),
  };
}

export async function login(
  _: unknown,
  args: { input: unknown },
  context: GraphQLContext,
): Promise<AuthPayload> {
  const input = parseInput(loginInputSchema.safeParse(args.input));

  const user = await context.prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!user) {
    throw unauthorized();
  }

  const passwordMatches = await compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw unauthorized();
  }

  return {
    token: createToken(user.id),
    user: mapUser(user),
  };
}

export async function me(
  _: unknown,
  __: unknown,
  context: GraphQLContext,
): Promise<AuthUser> {
  if (!context.userId) {
    throw unauthorized();
  }

  const user = await context.prisma.user.findUnique({
    where: {
      id: context.userId,
    },
  });

  if (!user) {
    throw unauthorized();
  }

  return mapUser(user);
}
