import { RouteDefinition } from '../routes';
import { handleLogin } from '../../auth/loginHandler';

export const authRoutes: RouteDefinition[] = [
  {
    resourcePath: '/v1/auth/login',
    httpMethod: 'POST',
    handler: handleLogin,
  },
];
