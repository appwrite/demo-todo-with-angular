import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Models } from 'appwrite';
import { Api } from 'src/app/helpers/api';
import { GlobalActions } from '../global';

/* State Model */
@Injectable()
export class AccountStateModel {
  account: Models.User<{}>;
  session: Models.Session;
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
  constructor(private router: Router, private ngZone: NgZone) {}

  @Selector()
  static userId(state: AccountStateModel) {
    return state.account.$id;
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
      let account = await Api.provider().account.get();
      patchState({
        account: account,
      });
      dispatch(new Account.Redirect({ path: '/todos' }));
    } catch (e: any) {
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
      let account = await Api.provider().account.create(
        'unique()',
        email,
        password,
        name
      );
      let session = await Api.provider().account.createSession(email, password);
      patchState({
        account,
        session,
      });
      dispatch(new Account.Redirect({ path: 'todos' }));
    } catch (e: any) {
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
      let account = await Api.provider().account.get();
      patchState({
        account: account,
      });
    } catch (e: any) {
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
    } catch (e: any) {      
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
    this.ngZone.run(() => {
      this.router.navigate([path]);
    });
  }
}
