import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/api/api.service';
import { DialogService } from 'src/app/common/dialog/dialog.service';
import { AbstractDialog } from 'src/app/common/dialog/abstract-dialog';
import type { TeacherResponseDto } from '@api/types';

@Component({
  selector: 'app-delete-teacher',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './delete-teacher.html',
  styleUrl: './delete-teacher.css',
})
export class DeleteTeacher extends AbstractDialog implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly dialogService = inject(DialogService);

  protected teachers = signal<TeacherResponseDto[]>([]);

  protected form: FormGroup = this.formBuilder.group({
    teacherId: this.formBuilder.control<string>(''),
  });

  ngOnInit() {
    this.apiService.getTeachers().subscribe({
      next: (r) => {
        this.teachers.set(r.data);
        const initialId = this.dialogService.getInitialEntityId();
        if (initialId) this.form.patchValue({ teacherId: initialId });
      },
      error: (e) => console.error('Error loading teachers:', e),
    });
  }

  protected get selectedTeacher(): TeacherResponseDto | null {
    const id = this.form.controls['teacherId'].value;
    return id ? this.teachers().find((t) => t.teacherId === id) ?? null : null;
  }

  protected onSubmit(): void {
    const teacherId = this.form.controls['teacherId'].value;
    if (!teacherId) return;

    this.apiService.deleteTeacher(teacherId).subscribe({
      next: () => {
        this.form.reset();
        this.closeDialog();
      },
      error: (e) => console.error('Error deleting teacher:', e),
    });
  }
}
