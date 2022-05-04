import { Inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Models } from 'appwrite';
import { Todo } from '../../models/Todo';
import { GlobalActions } from '../global';
import { AppWriteConfig, AppWriteConfigToken, AppwriteService } from '../../service/appwrite.service';

/** State Model */
export class TodoStateModel {
  todos: Array<Models.Document>;
}

export namespace Todos {
  /** Actions */
  export class Fetch {
    static readonly type = '[Todo] FetchTodos';
  }

  export class Add {
    static readonly type = '[Todo] AddTodo';
    constructor(
      public payload: { data: Todo; read: string[]; write: string[] }
    ) {}
  }

  export class Update {
    static readonly type = '[Todo] UpdateTodo';
    constructor(
      public payload: {
        documentId: string;
        data: Todo;
        read: string[];
        write: string[];
      }
    ) {}
  }

  export class Delete {
    static readonly type = '[Todo] DeleteTodo';
    constructor(public payload: { documentId: string }) {}
  }
}

@State<TodoStateModel>({
  name: 'todo',
  defaults: {
    todos: [],
  },
})
@Injectable()
export class TodoState {
  constructor(
    private appWriteService: AppwriteService,
    @Inject(AppWriteConfigToken) private config: AppWriteConfig
  ) {}

  @Selector()
  static getTodos(state: TodoStateModel) {
    return state.todos;
  }

  @Action(Todos.Fetch)
  async fetchTodos(
    { setState, dispatch }: StateContext<TodoStateModel>,
    action: Todos.Fetch
  ) {
    try {
      let todos =
        await this.appWriteService.appwriteinstance.database.listDocuments(
          this.config.collectionID
        );
      setState({
        todos: todos.documents,
      });
    } catch (e: any) {
      console.log('Failed to fetch todos');
      dispatch(
        new GlobalActions.setAlert({
          message: e.message,
          show: true,
          color: 'red',
        })
      );
    }
  }

  @Action(Todos.Add)
  async addTodo(
    { patchState, getState, dispatch }: StateContext<TodoStateModel>,
    action: Todos.Add
  ) {
    try {
      let { data, read, write } = action.payload;
      let todo =
        await this.appWriteService.appwriteinstance.database.createDocument(
          this.config.collectionID,
          'unique()',
          data,
          read,
          write
        );
      const todos = getState().todos;
      patchState({
        todos: [...todos, todo],
      });
    } catch (e: any) {
      console.log('Failed to add todo');
      dispatch(
        new GlobalActions.setAlert({
          message: e.message,
          show: true,
          color: 'red',
        })
      );
    }
  }

  @Action(Todos.Update)
  async updateTodo(
    { patchState, getState, dispatch }: StateContext<TodoStateModel>,
    action: Todos.Update
  ) {
    let { documentId, data, read, write } = action.payload;
    try {
      let updatedTodo =
        await this.appWriteService.appwriteinstance.database.updateDocument(
          this.config.collectionID,
          documentId,
          data,
          read,
          write
        );
      let todoList = [...getState().todos];
      const index = todoList.findIndex((todo) => todo.$id === updatedTodo.$id);
      if (index !== -1) {
        todoList[index] = updatedTodo;
        patchState({
          todos: todoList,
        });
      }
    } catch (e: any) {
      console.log('Failed to update todo');
      dispatch(
        new GlobalActions.setAlert({
          message: e.message,
          show: true,
          color: 'red',
        })
      );
    }
  }

  @Action(Todos.Delete)
  async deleteTodo(
    { patchState, getState, dispatch }: StateContext<TodoStateModel>,
    action: Todos.Delete
  ) {
    let { documentId } = action.payload;
    try {
      await this.appWriteService.appwriteinstance.database.deleteDocument(
        this.config.collectionID,
        documentId
      );
      let todos = getState().todos;
      todos = todos.filter((todo) => todo.$id !== documentId);
      patchState({
        todos,
      });
    } catch (e: any) {
      console.log('Failed to delete todo');
      dispatch(
        new GlobalActions.setAlert({
          message: e.message,
          show: true,
          color: 'red',
        })
      );
    }
  }
}
