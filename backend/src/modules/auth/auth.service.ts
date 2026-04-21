import { compare, hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { env } from '../../config/env.js';
import type { GraphQLContext } from '../../graphql/context.js';
import { badRequest, parseInput, unauthorized } from '../shared/errors.js';
import { mapUser } from './auth.mapper.js';
import {
  loginInputSchema,
  registerInputSchema,
  updateProfileInputSchema,
} from './auth.schemas.js';

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

export async function updateProfile(
  _: unknown,
  args: { input: unknown },
  context: GraphQLContext,
): Promise<AuthUser> {
  if (!context.userId) {
    throw unauthorized();
  }

  const input = parseInput(updateProfileInputSchema.safeParse(args.input));

  const user = await context.prisma.user.update({
    where: {
      id: context.userId,
    },
    data: {
      name: input.name,
    },
  });

  return mapUser(user);
}
