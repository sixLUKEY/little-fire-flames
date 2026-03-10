/**
 * Login handler: validates against dummy users (dev). Replace with Cognito or DB in production.
 */

import { V1RequestOptions } from '../types';
import { HttpRawResponse } from '../types';
import { HttpStatusCode } from '../http/types';
import { UserRole } from './types';

export interface LoginBody {
  email?: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  expiresIn?: number;
  role: UserRole;
  userId: string;
  email?: string;
}

/** Dummy users for dev. In production use Cognito or your user store. */
const DUMMY_USERS: Array<{ email: string; password: string; role: UserRole }> = [
  { email: 'principal@school.com', password: 'principal123', role: 'principal' },
  { email: 'teacher@school.com', password: 'teacher123', role: 'teacher' },
];

function findUser(email: string, password: string): { email: string; role: UserRole } | null {
  const normalized = email?.trim().toLowerCase();
  const user = DUMMY_USERS.find(
    (u) => u.email.toLowerCase() === normalized && u.password === password
  );
  return user ? { email: user.email, role: user.role } : null;
}

export async function handleLogin(
  options: V1RequestOptions<LoginBody>
): Promise<HttpRawResponse<LoginResponse>> {
  const body = options.body ?? {};
  const email = (body.email ?? '').trim();
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !password) {
    return {
      statusCode: HttpStatusCode.BAD_REQUEST,
      body: { message: 'Email and password are required' } as any,
    };
  }

  const user = findUser(email, password);
  if (!user) {
    return {
      statusCode: HttpStatusCode.UNAUTHORIZED,
      body: { message: 'Invalid email or password' } as any,
    };
  }

  const payload = { sub: `user-${user.email}`, email: user.email, role: user.role };
  const fakeToken = `placeholder.${Buffer.from(JSON.stringify(payload)).toString('base64')}.sig`;

  const responseBody: LoginResponse = {
    token: fakeToken,
    expiresIn: 3600,
    role: user.role,
    userId: payload.sub,
    email: user.email,
  };
  return {
    statusCode: 200,
    body: responseBody,
  };
}
