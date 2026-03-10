import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/api/api.service';
import { AbstractDialog } from 'src/app/common/dialog/abstract-dialog';
import type { SubjectResponseDto } from '@api/types';

@Component({
  selector: 'app-update-subject',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-subject.html',
  styleUrl: './update-subject.css',
})
export class UpdateSubject extends AbstractDialog implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected subjects = signal<SubjectResponseDto[]>([]);

  protected form: FormGroup = this.formBuilder.group({
    subjectId: this.formBuilder.control<string>(''),
    name: this.formBuilder.control<string>(''),
    description: this.formBuilder.control<string>(''),
  });

  ngOnInit() {
    this.apiService.getSubjects().subscribe({
      next: (r) => this.subjects.set(r.data),
      error: (e) => console.error('Error loading subjects:', e),
    });
  }

  protected onSubjectSelected(): void {
    const id = this.form.controls['subjectId'].value;
    const subject = this.subjects().find((s) => s.subjectId === id);
    if (subject) {
      this.form.patchValue({ name: subject.name, description: subject.description });
    }
  }

  protected onSubmit(): void {
    const subjectId = this.form.controls['subjectId'].value;
    if (!subjectId) return;

    this.apiService
      .updateSubject(subjectId, {
        name: this.form.controls['name'].value || undefined,
        description: this.form.controls['description'].value || undefined,
      })
      .subscribe({
        next: () => {
          this.form.reset();
          this.closeDialog();
        },
        error: (e) => console.error('Error updating subject:', e),
      });
  }
}
