import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Account } from 'src/app/store';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  handleLogout() {
    console.log("Logging Out ...")
    this.store.dispatch(new Account.Logout())
  }

}
