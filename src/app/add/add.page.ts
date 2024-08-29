import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService, Todo } from '../services/todo.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  todos: Todo[] = [];
  receivedTodo: Todo | null = null;
  nextId: number = 1;

  constructor(
    private route: ActivatedRoute,
    private todoService: TodoService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['todo']) {
        this.receivedTodo = JSON.parse(params['todo']);
        this.addToast('To-Do item added successfully'); // Show toast when a todo is received
      }
    });
    await this.loadTodos(); // Load todos when the component initializes
  }

  async ionViewWillEnter() {
    await this.loadTodos(); // Load todos when the page is about to enter
  }

  async deleteItem(id: number) {
    await this.todoService.deleteTodo(id); // Use the service to delete the todo
    await this.loadTodos(); // Reload the todos after deletion
    this.addToast('To-Do item deleted successfully'); // Show toast on deletion
    this.resetView(); // Reset the view to go back to the list after deletion
  }

  async markComplete() {
    if (this.receivedTodo) {
      await this.todoService.markAsComplete(this.receivedTodo.id);
      const updatedTodo = await this.todoService.getTodoById(this.receivedTodo.id);
      if (updatedTodo) {
        this.receivedTodo.done = updatedTodo.done ?? false;
      }
      this.showCompletionToast(this.receivedTodo.done ?? false);
    }
  }

  private async showCompletionToast(isDone: boolean) {
    const toast = await this.toastController.create({
      message: isDone ? 'Item marked as complete' : 'Item unmarked as complete',
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  private saveTodos() {
    this.todoService.saveTodos(this.todos);
  }

  private async loadTodos() {
    try {
      const storedTodos = await this.todoService.getTodos(); // Fetch todos from the service
      if (storedTodos) {
        this.todos = storedTodos;
        this.nextId = this.todos.length > 0 ? Math.max(...this.todos.map(t => t.id)) + 1 : 1; // Calculate the next ID
      }
    } catch (error) {
      console.error('Error loading todos', error); // Handle any errors
    }
  }

  navigateToHomePage() {
    this.router.navigate(['/home']);
  }

  viewTodoDetails(todo: Todo) {
    this.receivedTodo = todo;
  }

  resetView() {
    this.receivedTodo = null;
  }

  async addToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }


}
