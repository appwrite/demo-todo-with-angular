import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Todos, TodoState } from 'src/app/store';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnInit {

  @Input() todo: any;

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  deleteTodo(id: string){
    console.log(id)
    this.store.dispatch(new Todos.Delete({documentId : id}))
  }

}
