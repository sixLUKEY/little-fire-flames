import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/api/api.service';
import { AbstractDialog } from 'src/app/common/dialog/abstract-dialog';
import type { LearnerResponseDto } from '@api/types';

@Component({
  selector: 'app-delete-learner',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './delete-learner.html',
  styleUrl: './delete-learner.css',
})
export class DeleteLearner extends AbstractDialog implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected learners = signal<LearnerResponseDto[]>([]);

  protected form: FormGroup = this.formBuilder.group({
    studentId: this.formBuilder.control<string>(''),
  });

  ngOnInit() {
    this.apiService.getLearners().subscribe({
      next: (r) => this.learners.set(r.data),
      error: (e) => console.error('Error loading learners:', e),
    });
  }

  protected get selectedLearner(): LearnerResponseDto | null {
    const id = this.form.controls['studentId'].value;
    return id ? this.learners().find((l) => l.studentId === id) ?? null : null;
  }

  protected onSubmit(): void {
    const studentId = this.form.controls['studentId'].value;
    if (!studentId) return;

    this.apiService.deleteLearner(studentId).subscribe({
      next: () => {
        this.form.reset();
        this.closeDialog();
      },
      error: (e) => console.error('Error deleting learner:', e),
    });
  }
}
