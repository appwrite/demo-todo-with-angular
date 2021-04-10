import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofActionSuccessful, Select, Selector, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Account, Alert, GlobalState } from './store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'todo-with-angular';

  @Select(GlobalState.getAlert) alert: Observable<Alert>

  constructor(private actions: Actions, private store: Store, private router: Router) {
    this.store.dispatch(new Account.FetchAccount())
    
  }

  ngOnInit() {
    // this.actions.pipe(ofActionSuccessful(Account.FetchAccount)).subscribe(() => {
    //   this.router.navigate(['/todos']);
    // });
  }

  ngOnDestroy() {

  }
  
}
