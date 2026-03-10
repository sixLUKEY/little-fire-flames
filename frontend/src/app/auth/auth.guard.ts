import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Protects routes that require any signed-in user (e.g. Parents Corner).
 * Redirects to /login with returnUrl when not authenticated.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: router.url },
  });
};

/**
 * Redirects authenticated users away from login (e.g. to returnUrl or home).
 */
export const loginPageGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isAuthenticated()) {
    return true;
  }
  const returnUrl = router.parseUrl(router.url).queryParams['returnUrl'];
  if (returnUrl && typeof returnUrl === 'string') {
    return router.parseUrl(returnUrl);
  }
  return router.createUrlTree(['/']);
};
