import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import type { UserRole } from '@api/types';

export interface RoleGuardConfig {
  /** Allowed roles for this route. */
  allowedRoles: UserRole[];
  /** Where to redirect when not authenticated. */
  loginRedirect?: string;
  /** When authenticated but wrong role: redirect here (e.g. teacher on learners -> results). */
  wrongRoleRedirect?: string;
}

/**
 * Returns a guard that allows access only if the user is authenticated and has one of the allowed roles.
 * Redirects to login when not authenticated, or to wrongRoleRedirect when authenticated but role not allowed.
 */
export function roleGuard(config: RoleGuardConfig): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isAuthenticated()) {
      return router.createUrlTree([config.loginRedirect ?? '/login'], {
        queryParams: { returnUrl: router.url },
      });
    }

    if (auth.hasAnyRole(config.allowedRoles)) {
      return true;
    }

    return router.createUrlTree([config.wrongRoleRedirect ?? '/']);
  };
}
