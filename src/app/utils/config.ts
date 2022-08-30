import { environment } from '../../environments/environment';

export const Server = {
  endpoint: environment.APP_ENDPOINT,
  project: environment.APP_PROJECT_ID,
  databaseID: environment.APP_DATABASE_ID,
  collectionID: environment.APP_COLLECTION_ID,
};
