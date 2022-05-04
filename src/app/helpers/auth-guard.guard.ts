import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppwriteService } from '../service/appwrite.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private appWriteService: AppwriteService
  ) {}

  canActivate(): Promise<boolean> {
    return this.appWriteService.appwriteinstance.account
      .getSession('current')
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
