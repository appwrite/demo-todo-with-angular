import { Client, Databases, Account } from 'appwrite';
import { Server } from '../utils/config';

export class Api {
  private static sdk: Client | null;
  private static db: Databases | null;
  private static acc: Account | null;

  private static client() {
    if (this.sdk) return this.sdk;
    let client = new Client();

    client
      .setEndpoint(Server.endpoint)
      .setProject(Server.project)
      .setLocale('en-US');
    this.sdk = client;

    return this.sdk;
  }

  static database() {
    if (this.db) return this.db;
    this.db = new Databases(this.client(), Server.databaseID);
    return this.db;
  }

  static account() {
    if (this.acc) return this.acc;
    this.acc = new Account(this.client());
    return this.acc;
  }
}
