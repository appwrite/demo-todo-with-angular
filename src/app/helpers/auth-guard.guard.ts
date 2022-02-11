import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Api } from './api';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): Promise<boolean> {
    return Api.provider()
      .account.getSession('current')
      .then((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
          return false;
        } else {
          return true;
        }
      })
      .catch(() => {
        this.router.navigate(['/login']);
        return false;
      });
  }
}
