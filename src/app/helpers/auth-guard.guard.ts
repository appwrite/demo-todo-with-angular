import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AccountState } from '../store';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate() {
    let isAuthenticated = this.store.selectSnapshot(AccountState.isAuthenticated) 
    if(!isAuthenticated) {
      this.router.navigate(['/login']); 
      return false
    } else {
      return true
    }
  }
}
