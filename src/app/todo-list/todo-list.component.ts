import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogModule, DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddTodoDialogComponent } from '../add-todo-dialog/add-todo-dialog.component';  // Import the new dialog component

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    CalendarModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicDialogModule
  ],
  providers: [DialogService], // Required to inject DialogService
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  @ViewChild('newTodoInput') newTodoInput!: ElementRef;

  newTodoTitle: string = '';
  newTodoDueDate: Date | null = null;
  todos: any[] = [];
  errorMessageTitle: string = '';
  errorMessageDueDate: string = '';
  minDate: Date;
  showErrorTitle: boolean = false;
  showErrorDueDate: boolean = false;

  ref: DynamicDialogRef | undefined;

  constructor(public dialogService: DialogService) {
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.loadTodos();
  }

  openAddTodoDialog(): void {
    this.ref = this.dialogService.open(AddTodoDialogComponent, {
      header: 'Add New Task',
      width: '400px',
      contentStyle: { 'max-height': '400px', overflow: 'auto' },
      baseZIndex: 10000,
      data: {
        newTodoTitle: this.newTodoTitle,
        newTodoDueDate: this.newTodoDueDate,
        minDate: this.minDate,
      },
    });

    this.ref.onClose.subscribe((result: any) => {
      if (result) {
        this.newTodoTitle = result.newTodoTitle;
        this.newTodoDueDate = result.newTodoDueDate;
        this.addTodo();
      }
    });
  }

  addTodo(): void {
    this.showErrorTitle = false;
    this.showErrorDueDate = false;
    this.errorMessageTitle = '';
    this.errorMessageDueDate = '';

    if (!this.newTodoTitle.trim()) {
      this.errorMessageTitle = 'Task title is required.';
      this.showErrorTitle = true;
    }
    if (!this.newTodoDueDate) {
      this.errorMessageDueDate = 'Due date is required.';
      this.showErrorDueDate = true;
    }
    if (this.showErrorTitle || this.showErrorDueDate) {
      return;
    }

    const duplicateTodo = this.todos.find(
      (todo) =>
        todo.title.toLowerCase() === this.newTodoTitle.trim().toLowerCase()
    );
    if (duplicateTodo) {
      this.errorMessageTitle = 'This task already exists.';
      this.showErrorTitle = true;
      return;
    }

    const newTodo = {
      id: Date.now(),
      title: this.newTodoTitle.trim(),
      dueDate: this.newTodoDueDate,
      completed: false,
    };

    this.todos.push(newTodo);
    this.newTodoTitle = '';
    this.newTodoDueDate = null;
    this.errorMessageTitle = '';
    this.errorMessageDueDate = '';
    this.saveTodos();
  }

  toggleTodoCompletion(todo: any): void {
    todo.completed = !todo.completed;
    this.saveTodos();
  }

  deleteTodo(todo: any): void {
    this.todos = this.todos.filter((t) => t.id !== todo.id);
    this.saveTodos();
  }

  saveTodos(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('todos', JSON.stringify(this.todos));
    }
  }

  loadTodos(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTodos = localStorage.getItem('todos');
      if (storedTodos) {
        this.todos = JSON.parse(storedTodos);
      }
    }
  }

  get openTodos(): any[] {
    return this.todos.filter((todo) => !todo.completed);
  }

  get completedTodos(): any[] {
    return this.todos.filter((todo) => todo.completed);
  }
}