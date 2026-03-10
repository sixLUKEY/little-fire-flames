import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/api/api.service';
import { DialogService } from 'src/app/common/dialog/dialog.service';
import { AbstractDialog } from 'src/app/common/dialog/abstract-dialog';
import type { ClassResponseDto, TeacherResponseDto } from '@api/types';

@Component({
  selector: 'app-update-teacher',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-teacher.html',
  styleUrl: './update-teacher.css',
})
export class UpdateTeacher extends AbstractDialog implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly dialogService = inject(DialogService);

  protected teachers = signal<TeacherResponseDto[]>([]);
  protected classes = signal<ClassResponseDto[]>([]);

  protected form: FormGroup = this.formBuilder.group({
    teacherId: this.formBuilder.control<string>(''),
    name: this.formBuilder.control<string>(''),
    description: this.formBuilder.control<string>(''),
    classId: this.formBuilder.control<string>(''),
  });

  ngOnInit() {
    this.apiService.getTeachers().subscribe({
      next: (r) => {
        this.teachers.set(r.data);
        const initialId = this.dialogService.getInitialEntityId();
        if (initialId) {
          this.form.patchValue({ teacherId: initialId });
          this.onTeacherSelected();
        }
      },
      error: (e) => console.error('Error loading teachers:', e),
    });
    this.apiService.getClasses().subscribe({
      next: (r) => this.classes.set(r.data),
      error: (e) => console.error('Error loading classes:', e),
    });
  }

  protected onTeacherSelected(): void {
    const id = this.form.controls['teacherId'].value;
    const teacher = this.teachers().find((t) => t.teacherId === id);
    if (teacher) {
      this.form.patchValue({
        name: teacher.name,
        description: teacher.description,
        classId: teacher.classId ?? '',
      });
    }
  }

  protected onSubmit(): void {
    const teacherId = this.form.controls['teacherId'].value;
    if (!teacherId) return;

    const classIdVal = this.form.controls['classId'].value?.trim();
    this.apiService
      .updateTeacher(teacherId, {
        name: this.form.controls['name'].value || undefined,
        description: this.form.controls['description'].value || undefined,
        classId: classIdVal ? classIdVal : undefined,
      })
      .subscribe({
        next: () => {
          this.form.reset();
          this.closeDialog();
        },
        error: (e) => console.error('Error updating teacher:', e),
      });
  }
}
