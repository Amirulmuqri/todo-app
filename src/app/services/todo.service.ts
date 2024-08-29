import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface Todo {
  id: number;
  Title: string;
  Description: string;
  Clock_in: string;  // Include the Clock_in property
  done?: boolean;    // Assuming you want to track completion
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private storageInitialized: boolean = false;
  private storageKey = 'todos';

  constructor(private storage: Storage) {
    this.init();
  }

  private async init() {
    await this.storage.create();
    this.storageInitialized = true;
  }

  async saveTodos(todos: Todo[]): Promise<void> {
    await this.storage.set(this.storageKey, todos);
  }

  async addTodo(todo: Todo): Promise<void> {
    if (!this.storageInitialized) {
      await this.init();
    }
    const todos = await this.getTodos();
    todos.push(todo);
    await this.saveTodos(todos);
  }

  async getTodoById(id: number): Promise<Todo | undefined> {
    const todos = await this.getTodos();
    return todos.find(todo => todo.id === id);
  }

  async markAsComplete(id: number): Promise<void> {
    const todos = await this.getTodos();
    const item = todos.find(val => val.id === id);
    if (item) {
      item.done = !item.done;
      await this.saveTodos(todos);
    }
  }

  async deleteTodo(id: number): Promise<void> {
    let todos = await this.getTodos();
    todos = todos.filter(todo => todo.id !== id);
    await this.saveTodos(todos);
  }

  async getTodos(): Promise<Todo[]> {
    if (!this.storageInitialized) {
      await this.init();
    }
    return (await this.storage.get(this.storageKey)) || [];
  }
}
