import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Todo } from 'src/app/models/Todo';
import { Account, AccountState, Todos, TodoState } from 'src/app/store';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent {
  
  @Select(TodoState.getTodos) todos$: Observable<any>;

  addTodoForm: FormGroup;

  constructor(private store: Store, private formbuilder: FormBuilder) {
    this.store.dispatch(new Todos.Fetch());
    this.addTodoForm = this.formbuilder.group({
      content: ['', [Validators.required]],
    });
  }

  addTodo() {
    const data: Todo = {
      content: this.addTodoForm.value.content,
      isComplete: false,
    };
    const userId = this.store.selectSnapshot(AccountState.userId);
    const read = [`user:${userId}`];
    const write = read;
    this.store.dispatch(new Todos.Add({ data, read, write }));
  }

  handleLogout() {
    this.store.dispatch(new Account.Logout());
  }
}
