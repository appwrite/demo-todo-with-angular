import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Api } from 'src/app/helpers/api';
import { GlobalActions } from '../global';

export type Account = {
  $id: string;
  email: string;
  emailVerification: boolean;
  name: string;
  registration: number;
  status: number;
  prefs: object;
};

/* State Model */
@Injectable()
export class AccountStateModel {
  account: Account | null;
  session: object | null;
}

export namespace Account {
  /** Actions */
  export class Signup {
    static readonly type = '[Auth] Signup';
    constructor(
      public payload: { email: string; password: string; name: string }
    ) {}
  }

  export class FetchAccount {
    static readonly type = '[Auth] FetchAccount';
  }

  export class Login {
    static readonly type = '[Auth] Login';
    constructor(public payload: { email: string; password: string }) {}
  }

  export class Logout {
    static readonly type = '[Auth] Logout';
  }

  /** Events */
  export class Redirect {
    static readonly type = '[Auth] AccountRedirect';
    constructor(public payload: { path: string }) {}
  }
}

@State<AccountStateModel>({
  name: 'auth',
  defaults: {
    account: null,
    session: null,
  },
})
@Injectable()
export class AccountState {
  constructor(private router: Router) {}

  @Selector()
  static userId(state: AccountStateModel) {
    return state.account['$id'];
  }

  @Selector()
  static isAuthenticated(state: AccountStateModel): boolean {
    return !!state.account;
  }

  @Action(Account.Login)
  async login(
    { patchState, dispatch }: StateContext<AccountStateModel>,
    action: Account.Login
  ) {
    let { email, password } = action.payload;
    try {
      await Api.provider().account.createSession(email, password);
      let account = (await Api.provider().account.get()) as Account;
      patchState({
        account: account,
      });
      dispatch(new Account.Redirect({ path: '/todos' }));
    } catch (e) {
      console.log('Error Logging in');
      dispatch(
        new GlobalActions.setAlert({
          message: e.message,
          show: true,
          color: 'red',
        })
      );
    }
  }

  @Action(Account.Signup)
  async signup(
    { patchState, dispatch }: StateContext<AccountStateModel>,
    action: Account.Signup
  ) {
    let { email, password, name } = action.payload;
    try {
      let account = (await Api.provider().account.create(
        email,
        password,
        name
      )) as Account;
      let session: object = await Api.provider().account.createSession(email, password);
      patchState({
        account,
        session,
      });
      dispatch(new Account.Redirect({ path: 'todos' }));
    } catch (e) {
      console.log('Error creating Account');
      dispatch(
        new GlobalActions.setAlert({
          message: e.message,
          show: true,
          color: 'red',
        })
      );
    }
  }

  @Action(Account.FetchAccount)
  async fetchAccount(
    { patchState, dispatch }: StateContext<AccountStateModel>,
    action: Account.FetchAccount
  ) {
    try {
      let account = (await Api.provider().account.get()) as Account;
      patchState({
        account: account,
      });
    } catch (e) {
      console.log('Error fetching Account');
      dispatch(
        new GlobalActions.setAlert({
          message: e.message,
          show: true,
          color: 'red',
        })
      );
    }
  }

  @Action(Account.Logout)
  async logout(
    { patchState, dispatch }: StateContext<AccountStateModel>,
    action: Account.Logout
  ) {
    try {
      await Api.provider().account.deleteSession('current');
      patchState({
        account: null,
        session: null,
      });
      dispatch(new Account.Redirect({ path: '' }));
    } catch (e) {      
      console.log('Error Loggin Out');
      dispatch(
        new GlobalActions.setAlert({
          message: e.message,
          show: true,
          color: 'red',
        })
      );
    }
  }

  @Action(Account.Redirect)
  redirect(ctx: StateContext<AccountStateModel>, action: Account.Redirect) {
    const { path } = action.payload;
    this.router.navigate([path]);
  }
}
