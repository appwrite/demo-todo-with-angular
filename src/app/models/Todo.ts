import { Models } from 'appwrite';

export type Todo = Models.Document & {
    content: string,
    isComplete: boolean
}