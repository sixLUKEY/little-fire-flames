import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/api/api.service';
import { AbstractDialog } from 'src/app/common/dialog/abstract-dialog';
import type { ClassResponseDto } from '@api/types';

@Component({
  selector: 'app-create-learner',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-learner.html',
  styleUrl: './create-learner.css',
})
export class CreateLearner extends AbstractDialog implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected classes = signal<ClassResponseDto[]>([]);
  protected generatedStudentId = signal<string>('');

  protected form: FormGroup = this.formBuilder.group({
    studentName: this.formBuilder.control<string>(''),
    classId: this.formBuilder.control<string>(''),
  });

  ngOnInit() {
    // Generate initial student ID
    this.generateStudentId();

    // Load classes
    this.apiService.getClasses().subscribe({
      next: (response) => {
        this.classes.set(response.data);
      },
      error: (error) => {
        console.error('Error loading classes:', error);
      }
    });
  }

  protected generateStudentId(): void {
    // Generate an 8-digit random number
    const min = 10000000; // 8 digits minimum
    const max = 99999999; // 8 digits maximum
    const randomId = Math.floor(Math.random() * (max - min + 1)) + min;
    this.generatedStudentId.set(randomId.toString());
  }

  protected onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.apiService.createLearner({
      name: this.form.controls['studentName'].value,
      studentId: this.generatedStudentId(),
      classId: this.form.controls['classId'].value,
    }).subscribe({
      next: (response) => {
        console.log('Learner created successfully:', response);
        this.form.reset();
        this.generateStudentId(); // Generate new ID for next creation
        this.closeDialog();
      },
      error: (error) => {
        console.error('Error creating learner:', error);
        // If error is due to duplicate studentId, generate a new one
        if (error?.message?.includes('studentId') || error?.message?.includes('duplicate')) {
          this.generateStudentId();
        }
      }
    });
  }
}
