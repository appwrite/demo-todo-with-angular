import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Appwrite } from 'appwrite';

export interface AppWriteConfig {
  endpoint: string;
  projectId: string;
  collectionID: string;
}

export const AppWriteConfigToken = new InjectionToken<AppWriteConfig>(
  'Config Token'
);

@Injectable({
  providedIn: 'root',
})
export class AppwriteService {
  appwriteinstance: Appwrite | undefined;
  constructor(@Inject(AppWriteConfigToken) private config: AppWriteConfig) {}

  init() {
    this.appwriteinstance = new Appwrite();
    this.appwriteinstance
      .setEndpoint(this.config.endpoint)
      .setProject(this.config.projectId)
      .setLocale('en-US');
  }
}
