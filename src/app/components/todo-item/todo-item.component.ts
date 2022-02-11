import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Todo } from 'src/app/models/Todo';
import { AccountState, Todos } from 'src/app/store';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
})
export class TodoItemComponent implements OnInit {
  @Input() todo: Todo;

  constructor(private store: Store) {}

  ngOnInit(): void {}

  deleteTodo(documentId: string) {
    console.log(documentId);
    this.store.dispatch(new Todos.Delete({ documentId }));
  }

  toggleTodo(documentId: string, todo: Todo) {
    console.log(documentId);
    console.log("Toggle Todo ")
    const data: Todo = {
      ...todo,
      isComplete: !todo.isComplete,
    };

    let userId = this.store.selectSnapshot(AccountState.userId);
    const read = [`user:${userId}`];
    const write = read;
    this.store.dispatch(new Todos.Update({ documentId, data, read, write }));
  }
}
