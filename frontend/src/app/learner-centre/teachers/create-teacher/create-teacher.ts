import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/api/api.service';
import { AbstractDialog } from 'src/app/common/dialog/abstract-dialog';
import type { SubjectResponseDto } from '@api/types';

@Component({
  selector: 'app-create-teacher',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-teacher.html',
  styleUrl: './create-teacher.css',
})
export class CreateTeacher extends AbstractDialog implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected subjects = signal<SubjectResponseDto[]>([]);

  protected form: FormGroup = this.formBuilder.group({
    name: this.formBuilder.control<string>(''),
    description: this.formBuilder.control<string>(''),
    subjectId: this.formBuilder.control<string>(''),
  });

  ngOnInit() {
    this.apiService.getSubjects().subscribe({
      next: (response) => {
        this.subjects.set(response.data);
      },
      error: (error) => {
        console.error('Error loading subjects:', error);
      }
    });
  }

  protected onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.apiService.createTeacher({
      name: this.form.controls['name'].value,
      description: this.form.controls['description'].value,
      subjectId: this.form.controls['subjectId'].value,
    }).subscribe({
      next: (response) => {
        console.log('Teacher created successfully:', response);
        this.form.reset();
        this.closeDialog();
      },
      error: (error) => {
        console.error('Error creating teacher:', error);
      }
    });
  }
}
