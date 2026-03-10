/**
 * Express middleware: validates Authorization: Bearer <token> and sets req.user (AuthContext).
 * Public routes (e.g. POST /v1/auth/login, health) should be registered before this middleware.
 * When JWT verification is implemented, decode and verify the token here.
 */

import { Request, Response, NextFunction } from 'express';
import { AuthContext } from './types';
import { HttpStatusCode } from '../http/types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthContext;
    }
  }
}

const BEARER_PREFIX = 'Bearer ';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith(BEARER_PREFIX)) {
    res.status(HttpStatusCode.UNAUTHORIZED).json({
      message: 'Missing or invalid Authorization header',
    });
    return;
  }

  const token = authHeader.slice(BEARER_PREFIX.length).trim();
  if (!token) {
    res.status(HttpStatusCode.UNAUTHORIZED).json({
      message: 'Missing token',
    });
    return;
  }

  // TODO: verify JWT (e.g. with jsonwebtoken + JWKS or secret), decode payload, set req.user
  // For now: accept any non-empty token as placeholder and set a stub user (foundation only).
  try {
    const payload = decodePlaceholder(token);
    (req as Request).user = {
      userId: payload.sub,
      email: payload.email,
      role: payload.role as AuthContext['role'],
      scope: payload.scope,
    };
    next();
  } catch {
    res.status(HttpStatusCode.UNAUTHORIZED).json({
      message: 'Invalid token',
    });
  }
}

/** Placeholder: in production replace with real JWT verify + decode. */
function decodePlaceholder(token: string): { sub: string; email?: string; role?: string; scope?: string[] } {
  if (!token) throw new Error('Empty token');
  try {
    const parts = token.split('.');
    if (parts.length < 2) return { sub: 'placeholder-user-id', email: undefined, scope: [] };
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
    return {
      sub: payload.sub ?? 'placeholder-user-id',
      email: payload.email,
      role: payload.role,
      scope: payload.scope,
    };
  } catch {
    return { sub: 'placeholder-user-id', email: undefined, scope: [] };
  }
}
