import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/api/api.service';
import { DialogService } from 'src/app/common/dialog/dialog.service';
import { AbstractDialog } from 'src/app/common/dialog/abstract-dialog';
import type { ClassResponseDto, LearnerResponseDto } from '@api/types';

@Component({
  selector: 'app-update-learner',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-learner.html',
  styleUrl: './update-learner.css',
})
export class UpdateLearner extends AbstractDialog implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly dialogService = inject(DialogService);

  protected learners = signal<LearnerResponseDto[]>([]);
  protected classes = signal<ClassResponseDto[]>([]);

  protected form: FormGroup = this.formBuilder.group({
    studentId: this.formBuilder.control<string>(''),
    name: this.formBuilder.control<string>(''),
    classId: this.formBuilder.control<string>(''),
  });

  ngOnInit() {
    this.apiService.getLearners().subscribe({
      next: (r) => {
        this.learners.set(r.data);
        const initialId = this.dialogService.getInitialEntityId();
        if (initialId) {
          this.form.patchValue({ studentId: initialId });
          this.onLearnerSelected();
        }
      },
      error: (e) => console.error('Error loading learners:', e),
    });
    this.apiService.getClasses().subscribe({
      next: (r) => this.classes.set(r.data),
      error: (e) => console.error('Error loading classes:', e),
    });
  }

  protected onLearnerSelected(): void {
    const id = this.form.controls['studentId'].value;
    const learner = this.learners().find((l) => l.studentId === id);
    if (learner) {
      this.form.patchValue({ name: learner.name, classId: learner.classId });
    }
  }

  protected onSubmit(): void {
    const studentId = this.form.controls['studentId'].value;
    if (!studentId) return;

    this.apiService
      .updateLearner(studentId, {
        name: this.form.controls['name'].value || undefined,
        classId: this.form.controls['classId'].value || undefined,
      })
      .subscribe({
        next: () => {
          this.form.reset();
          this.closeDialog();
        },
        error: (e) => console.error('Error updating learner:', e),
      });
  }
}
