import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
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
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('newTodoInput') newTodoInput!: ElementRef;

  newTodoTitle: string = '';
  newTodoDueDate: Date | null = null;
  todos: any[] = [];
  errorMessage: string = '';
  minDate: Date;
  showErrorTitle: boolean = false;
  showErrorDueDate: boolean = false;

  constructor() {
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.loadTodos();
  }

  addTodo(): void {
    this.showErrorTitle = false;
    this.showErrorDueDate = false;

    if (!this.newTodoTitle.trim()) {
      this.errorMessage = 'Task title is required.';
      this.showErrorTitle = true;
    } 
    if (!this.newTodoDueDate) {
      this.errorMessage = 'Due date is required.';
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
      this.errorMessage = 'This task already exists.';
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
    this.errorMessage = '';
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

  get activeTodos(): any[] {
    return this.todos.filter((todo) => !todo.completed);
  }

  get completedTodos(): any[] {
    return this.todos.filter((todo) => todo.completed);
  }

  focusAddTask(event: Event): void {
    event.preventDefault();
    this.newTodoInput.nativeElement.focus();
  }
}
