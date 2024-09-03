import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-add-todo-dialog',
  standalone: true,
  imports: [FormsModule,CommonModule,CalendarModule,FloatLabelModule],
  templateUrl: './add-todo-dialog.component.html',
  styleUrls: ['./add-todo-dialog.component.scss'],
})
export class AddTodoDialogComponent {
  newTodoTitle: string = '';
  newTodoDueDate: Date | null = null;
  minDate: Date;
  errorMessageTitle: string = '';
  errorMessageDueDate: string = '';
  showErrorTitle: boolean = false;
  showErrorDueDate: boolean = false;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.newTodoTitle = config.data.newTodoTitle;
    this.newTodoDueDate = config.data.newTodoDueDate;
    this.minDate = config.data.minDate;
  }

  confirm() {
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

    this.ref.close({
      newTodoTitle: this.newTodoTitle,
      newTodoDueDate: this.newTodoDueDate,
    });
  }

  cancel() {
    this.ref.close();
  }
}