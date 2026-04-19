import { GraphQLError } from 'graphql';

export function unauthorized() {
  return new GraphQLError('Unauthorized', {
    extensions: {
      code: 'UNAUTHORIZED',
    },
  });
}

export function badRequest(message: string) {
  return new GraphQLError(message, {
    extensions: {
      code: 'BAD_USER_INPUT',
    },
  });
}

export function notFound(message: string) {
  return new GraphQLError(message, {
    extensions: {
      code: 'NOT_FOUND',
    },
  });
}

export function parseInput<T>(
  result:
    | { success: true; data: T }
    | { success: false; error: { issues: { message: string }[] } },
) {
  if (result.success) {
    return result.data;
  }

  throw badRequest(result.error.issues[0]?.message ?? 'Invalid input');
}

export function requireUserId(userId: string | null) {
  if (!userId) {
    throw unauthorized();
  }

  return userId;
}
