import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofActionDispatched, ofActionSuccessful, Store } from '@ngxs/store';
import { Account } from './store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'todo-with-angular';

  constructor(private actions: Actions, private store: Store, private router: Router) {}

  ngOnInit() {
    this.store.dispatch(new Account.FetchAccount())

    this.actions.pipe(ofActionDispatched(Account.Logout)).subscribe(() => {
      this.router.navigate(['/']);
    });

    // this.actions.pipe(ofActionSuccessful(Account.FetchAccount)).subscribe(() => {
    //   this.router.navigate(['/todos']);
    // });
  }

  ngOnDestroy() {

  }
  
}
