import { Component, OnInit } from '@angular/core';
import { Todo, TodoService } from '../todo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css']
})
export class TodoFormComponent implements OnInit {
  todoForm: FormGroup;
  todoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
    ) {
    this.todoForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      completed: [false]
    });
  }

  ngOnInit(): void {
    this.todoId = this.route.snapshot.paramMap.get('id') ? +this.route.snapshot.paramMap.get('id')! : null;

    if (this.todoId) {
      this.todoService.getTodoById(this.todoId).subscribe({
        next: (todo) => this.todoForm.patchValue(todo),
        error: (error) => console.error('Error fetching todo:', error)
      });
    }
  }

  onSubmit(): void {
    if (this.todoForm.invalid) {
      return;
    }

    const todo: Todo = this.todoForm.value;

    if (this.todoId) {
      todo.id = this.todoId;
      this.todoService.updateTodo(todo).subscribe({
        next: (response) => {
          console.log('Todo updated successfully:', response);
          this.toastr.info('Updated Successfully!', '');
          this.router.navigate(['/todos']);
        },
        error: (error) => console.error('Error updating todo:', error)
      });
    } else {debugger;
      this.todoService.createTodo(todo).subscribe({
        next: (response) => {
          console.log('Todo created successfully:', response);
          this.toastr.success('Created Successfully!', '');

          this.router.navigate(['/todos']);
        },
        error: (error) => console.error('Error creating todo:', error)
      });
    }
  }
}
