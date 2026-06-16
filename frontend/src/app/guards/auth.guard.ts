import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// authGuard: Protects routes that require a logged-in user. Redirects to login if no token is found.
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

// adminGuard: Protects admin-only routes. Redirects to login if token is missing or if the user is not an Admin.
export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole') || '';

  if (token && role.toLowerCase() === 'admin') {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
