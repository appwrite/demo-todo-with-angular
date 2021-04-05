// Inside the root 'index.ts' file of our store, eg - store/index.ts
import { AuthState } from './account';
import { TodoState } from './todos';

// Still allow other modules to take what they need, eg action & selectors
export * from './account';
export * from './todos';

// rolls up our states into one const
export const AppState = [AuthState, TodoState];
