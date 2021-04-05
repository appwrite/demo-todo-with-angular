import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Api } from 'src/app/helpers/api';

/* State Model */
@Injectable()
export class AccountStateModel {
  account: object | null;
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

  constructor(private rotuer: Router) {}

  @Selector()
  static account(state: AccountStateModel): object | null {
    return state.account;
  }

  @Selector()
  static isAuthenticated(state: AccountStateModel): boolean {
    return !!state.account;
  }

  @Action(Account.Login)
  async login({ patchState, dispatch }: StateContext<AccountStateModel>, action: Account.Login) {
    let { email, password } = action.payload;
    try {
      await Api.provider().account.createSession(email, password);
      let account = await Api.provider().account.get();
      patchState({
        account: account,
      });
      this.rotuer.navigate(['/todos'])
    } catch (e) {
      console.log('Error Logging in');
    }
  }

  @Action(Account.Signup)
  async signup(
    { patchState }: StateContext<AccountStateModel>,
    action: Account.Signup
  ) {
    let { email, password, name } = action.payload;
    try {
      let account = await Api.provider().account.create(email, password, name);
      let session = await Api.provider().account.createSession(email, password);
      patchState({
        account,
        session,
      });
      this.rotuer.navigate(['/todos'])
    } catch (e) {
      console.log('Error creating Account');
    }
  }

  @Action(Account.FetchAccount)
  async fetchAccount(
    { patchState }: StateContext<AccountStateModel>,
    action: Account.FetchAccount
  ) {
    try {
      let account = await Api.provider().account.get();
      patchState({
        account: account,
      });
    } catch (e) {
      console.log('Error fetching Account');
    }
  }

  @Action(Account.Logout)
  async logout(
    { patchState }: StateContext<AccountStateModel>,
    action: Account.Logout
  ) {
    try {
      await Api.provider().account.deleteSession('current');
      patchState({
        account: null,
        session: null,
      });
    } catch (e) {
      console.log('Error Loggin Out');
    }
  }
}
