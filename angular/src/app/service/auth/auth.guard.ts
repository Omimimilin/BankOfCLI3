import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * If `reverse` is true, we want guests only (redirect logged-in users to dashboard)
 * If `reverse` is false, we want authenticated users only (redirect guests to login)
 */
export const authGuard: (options: { reverse: boolean }) => CanActivateFn =
  ({ reverse }: { reverse: boolean }) =>
  async () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const isLoggedIn = await authService.isLoggedIn();
    if (!isLoggedIn) authService.logout();

    if (reverse === isLoggedIn) {
      return router.createUrlTree([isLoggedIn ? '/dashboard' : '/login']);
    }

    return true;
  };
