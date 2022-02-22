import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Account, Alert, GlobalState } from './store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'todo-with-angular';

  @Select(GlobalState.getAlert) alert: Observable<Alert>

  constructor(private actions: Actions, private store: Store, private router: Router) {
    this.store.dispatch(new Account.FetchAccount())
    
  }
}
