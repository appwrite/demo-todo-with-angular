import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Api } from 'src/app/helpers/api';

/* State Model */
@Injectable()
export class AccountStateModel {
  account: object | null;
  session: object | null;
}

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

@State<AccountStateModel>({
  name: 'auth',
  defaults: {
    account: null,
    session: null,
  },
})
@Injectable()
export class AccountState {
  @Selector()
  static account(state: AccountStateModel): object | null {
    return state.account;
  }

  @Selector()
  static isAuthenticated(state: AccountStateModel): boolean {
    return !!state.account;
  }

  @Action(Login)
  async login({ patchState }: StateContext<AccountStateModel>, action: Login) {
    let { email, password } = action.payload;
    try {
      await Api.provider().account.createSession(email, password);
      let account = Api.provider().account.get();
      patchState({
        account: account,
      });
    } catch (e) {
      console.log('Error Logging in');
    }
  }

  @Action(Signup)
  async signup(
    { patchState }: StateContext<AccountStateModel>,
    action: Signup
  ) {
    let { email, password, name } = action.payload;
    try {
      let account = await Api.provider().account.create(email, password, name);
      await Api.provider().account.createSession(email, password);
      patchState({
        account: account,
      });
    } catch (e) {
      console.log('Error creating Account');
    }
  }

  @Action(FetchAccount)
  async fetchAccount(
    { patchState }: StateContext<AccountStateModel>,
    action: FetchAccount
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

  @Action(Logout)
  async logout(
    { patchState }: StateContext<AccountStateModel>,
    action: Logout
  ) {
    try {
      await Api.provider().account.deleteSession('current');
      patchState({
        account: null,
      });
    } catch (e) {
      console.log('Error Loggin Out');
    }
  }
}
