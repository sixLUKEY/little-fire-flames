/**
 * Auth types for token-based auth. Used by:
 * - Express: authMiddleware validates Bearer token and sets req.user
 * - Lambda: API Gateway Lambda authorizer validates token and passes claims
 *   in event.requestContext.authorizer (see docs/auth.md)
 */

export interface JwtPayload {
  sub: string;       // subject (e.g. user id)
  email?: string;
  iat?: number;
  exp?: number;
  scope?: string[];
}

export interface AuthContext {
  userId: string;
  email?: string;
  scope?: string[];
}

/** Claims passed from API Gateway Lambda authorizer to the Lambda. */
export interface AuthorizerContext {
  userId?: string;
  email?: string;
  scope?: string;
}
