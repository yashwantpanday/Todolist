import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Todo, TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.css']
})
export class TodoDetailComponent {
  //todo: Todo | undefined;
  todo:any;

  constructor(private route: ActivatedRoute, private todoService: TodoService) {}

  ngOnInit(): void {
      this.todoService.getTodos().subscribe(data => this.todo = data);
  }
}
