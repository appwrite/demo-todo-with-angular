import { Account, Client as Appwrite, Databases } from 'appwrite';
import { Server } from '../utils/config';

export class Api {
  private static sdk: { account: Account, database: Databases } | null;

  static provider() {
    if (this.sdk) return this.sdk;
    let client = new Appwrite();
    client
      .setEndpoint(Server.endpoint)
      .setProject(Server.project)
      .setLocale('en-US');

    const database = new Databases(client, Server.databaseID);
    const account = new Account(client);
    this.sdk = { account, database };
    return this.sdk;
  }
}
