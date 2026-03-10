import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/api/api.service';
import { AbstractDialog } from 'src/app/common/dialog/abstract-dialog';
import type { ClassResponseDto } from '@api/types';

@Component({
  selector: 'app-delete-class',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './delete-class.html',
  styleUrl: './delete-class.css',
})
export class DeleteClass extends AbstractDialog implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected classes = signal<ClassResponseDto[]>([]);

  protected form: FormGroup = this.formBuilder.group({
    classId: this.formBuilder.control<string>(''),
  });

  ngOnInit() {
    this.apiService.getClasses().subscribe({
      next: (r) => this.classes.set(r.data),
      error: (e) => console.error('Error loading classes:', e),
    });
  }

  protected get selectedClass(): ClassResponseDto | null {
    const id = this.form.controls['classId'].value;
    return id ? this.classes().find((c) => c.classId === id) ?? null : null;
  }

  protected onSubmit(): void {
    const classId = this.form.controls['classId'].value;
    if (!classId) return;

    this.apiService.deleteClass(classId).subscribe({
      next: () => {
        this.form.reset();
        this.closeDialog();
      },
      error: (e) => console.error('Error deleting class:', e),
    });
  }
}
