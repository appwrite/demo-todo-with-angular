import { Appwrite } from 'appwrite';
import { Server } from '../utils/config';

export class Api {
  private static sdk: Appwrite | null;

  static provider() {
    if (this.sdk) return this.sdk;
    let client = new Appwrite();
    client
      .setEndpoint(Server.endpoint)
      .setProject(Server.project)
      .setLocale('en-US');
    this.sdk = client;
    return this.sdk;
  }
}
