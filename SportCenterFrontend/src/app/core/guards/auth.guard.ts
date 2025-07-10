import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AccountService } from '../../account/account.service';

export const canActivate: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {

  console.log('Auth Guard is running!');

  const accountService = inject(AccountService);
  const router = inject(Router);

  const isAuthenticated = accountService.isAuthenticated();
  console.log('Is user authenticated?', isAuthenticated);

  if (accountService.isAuthenticated()) {
    return true;
  } else {
    // store the attempted URL for redirection
    accountService.redirectUrl = state.url;
    // redirect to the Login page with redirect URL
    return router.createUrlTree(['/account/login'], {
      queryParams: { returnUrl: state.url }
    });
  }
};
