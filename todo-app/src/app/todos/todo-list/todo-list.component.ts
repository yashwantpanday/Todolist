import { Component, OnInit } from '@angular/core';
import { Todo, TodoService } from '../todo.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];

  constructor(private todoService: TodoService,private toastr: ToastrService) {}

  ngOnInit(): void {
    this.fetchTodos();
  }

  fetchTodos(): void {
    this.todoService.getTodos().subscribe({
      next: (data) => this.todos = data,
      error: (error) => console.error('Error fetching todos:', error)
    });
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id).subscribe({
      next: () => this.fetchTodos(),
      error: (error) => console.error('Error deleting todo:', error)
    });
    this.toastr.error('Deleted Successfully!', '');
  }
}
