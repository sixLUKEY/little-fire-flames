import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/api/api.service';
import { AbstractDialog } from 'src/app/common/dialog/abstract-dialog';
import type { SubjectResponseDto, TeacherResponseDto, CreateClassDto } from '@api/types';

@Component({
  selector: 'app-create-class',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-class.html',
  styleUrl: './create-class.css',
})
export class CreateClass extends AbstractDialog implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected subjects = signal<SubjectResponseDto[]>([]);
  protected teachers = signal<TeacherResponseDto[]>([]);

  protected form: FormGroup = this.formBuilder.group({
    name: this.formBuilder.control<string>(''),
    teacherId: this.formBuilder.control<string>(''),
    subjectIds: this.formBuilder.array<string[]>([]),
  });

  ngOnInit() {
    // Load subjects
    this.apiService.getSubjects().subscribe({
      next: (response) => {
        this.subjects.set(response.data);
        // Initialize form array with checkboxes for each subject
        const subjectIdsArray = this.form.get('subjectIds') as FormArray;
        response.data.forEach(() => {
          subjectIdsArray.push(this.formBuilder.control(false));
        });
      },
      error: (error) => {
        console.error('Error loading subjects:', error);
      }
    });

    // Load teachers
    this.apiService.getTeachers().subscribe({
      next: (response) => {
        this.teachers.set(response.data);
      },
      error: (error) => {
        console.error('Error loading teachers:', error);
      }
    });
  }

  protected get subjectIdsArray(): FormArray {
    return this.form.get('subjectIds') as FormArray;
  }

  protected getSubjectControl(index: number): FormControl<boolean> {
    return this.subjectIdsArray.at(index) as FormControl<boolean>;
  }

  protected onSubmit() {
    if (this.form.invalid) {
      return;
    }

    // Get selected subject IDs
    const selectedSubjectIds = this.subjectIdsArray.controls
      .map((control, index) => control.value ? this.subjects()[index].subjectId : null)
      .filter((id): id is string => id !== null);

    const createData: CreateClassDto = {
      name: this.form.controls['name'].value,
      teacherId: this.form.controls['teacherId'].value,
      subjectIds: selectedSubjectIds.length > 0 ? selectedSubjectIds : undefined,
    };

    this.apiService.createClass(createData).subscribe({
      next: (response) => {
        console.log('Class created successfully:', response);
        this.form.reset();
        this.closeDialog();
      },
      error: (error) => {
        console.error('Error creating class:', error);
      }
    });
  }
}
