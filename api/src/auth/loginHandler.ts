/**
 * Placeholder login handler. Returns a fake token so clients can send
 * Authorization: Bearer <token> for protected routes. Replace with real
 * login (e.g. Cognito, OIDC, or your own credential check + JWT sign).
 */

import { V1RequestOptions } from '../types';
import { HttpRawResponse } from '../types';

export interface LoginBody {
  email?: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  expiresIn?: number;
}

export async function handleLogin(
  options: V1RequestOptions<LoginBody>
): Promise<HttpRawResponse<LoginResponse>> {
  const body = options.body ?? {};
  const email = body.email ?? 'user@example.com';

  // TODO: validate credentials (e.g. against DB or Cognito), then sign JWT.
  const fakeToken = `placeholder.${Buffer.from(JSON.stringify({ sub: 'user-1', email })).toString('base64')}.sig`;

  return {
    statusCode: 200,
    body: {
      token: fakeToken,
      expiresIn: 3600,
    },
  };
}
