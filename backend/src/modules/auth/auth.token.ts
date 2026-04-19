import jwt from 'jsonwebtoken';

import { env } from '../../config/env.js';

type JwtPayload = {
  sub?: string;
};

export function getUserIdFromAuthorizationHeader(authorization: string | null) {
  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }

  const token = authorization.replace('Bearer ', '').trim();

  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    return payload.sub ?? null;
  } catch {
    return null;
  }
}
