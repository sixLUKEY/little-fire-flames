/**
 * Auth types for token-based auth. Used by:
 * - Express: authMiddleware validates Bearer token and sets req.user
 * - Lambda: API Gateway Lambda authorizer validates token and passes claims
 *   in event.requestContext.authorizer (see docs/auth.md)
 */

/** Staff role for tiered access. Parents use child's studentId on Parents Corner (no role). */
export type UserRole = 'teacher' | 'principal';

export interface JwtPayload {
  sub: string;       // subject (e.g. user id)
  email?: string;
  role?: UserRole;
  iat?: number;
  exp?: number;
  scope?: string[];
}

export interface AuthContext {
  userId: string;
  email?: string;
  role?: UserRole;
  scope?: string[];
}

/** Claims passed from API Gateway Lambda authorizer to the Lambda. */
export interface AuthorizerContext {
  userId?: string;
  email?: string;
  role?: UserRole;
  scope?: string;
}
