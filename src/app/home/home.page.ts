import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { TodoService, Todo } from '../services/todo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  todos: Todo[] = [];

  newTodo: Omit<Todo, 'id'> = {
    Title: '',
    Description: '',
    Clock_in: ''
  };

  constructor(private todoService: TodoService, private router: Router) {}

   ngOnInit() {
    this.loadTodos();
  }

 async loadTodos() {
    try {
      // Await the Promise returned by getTodos
      this.todos = await this.todoService.getTodos();
    } catch (error) {
      console.error('Error loading todos', error);
    }
  }

  addTodo(): void {
    const todo: Todo = {
      ...this.newTodo,
      id: Date.now(),
    };

    this.todoService.addTodo(todo); 

    // Redirect to add page with the newly added todo
    const navigationExtras: NavigationExtras = {
      queryParams: {
        todo: JSON.stringify(todo),
      },
    };
    this.router.navigate(['/add'], navigationExtras);

    this.resetForm();
  }

  
  

  viewTodoDetails(todo: Todo) {
    const navigationExtras: NavigationExtras = {
      queryParams: { todo: JSON.stringify(todo) }
    };
    this.router.navigate(['/add'], navigationExtras);
  }

  resetForm() {
    this.newTodo = {
      Title: '',
      Description: '',
      Clock_in: ''
    };
  }
}
