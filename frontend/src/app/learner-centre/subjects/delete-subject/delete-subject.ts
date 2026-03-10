import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/api/api.service';
import { DialogService } from 'src/app/common/dialog/dialog.service';
import { AbstractDialog } from 'src/app/common/dialog/abstract-dialog';
import type { SubjectResponseDto } from '@api/types';

@Component({
  selector: 'app-delete-subject',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './delete-subject.html',
  styleUrl: './delete-subject.css',
})
export class DeleteSubject extends AbstractDialog implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly dialogService = inject(DialogService);

  protected subjects = signal<SubjectResponseDto[]>([]);

  protected form: FormGroup = this.formBuilder.group({
    subjectId: this.formBuilder.control<string>(''),
  });

  ngOnInit() {
    this.apiService.getSubjects().subscribe({
      next: (r) => {
        this.subjects.set(r.data);
        const initialId = this.dialogService.getInitialEntityId();
        if (initialId) this.form.patchValue({ subjectId: initialId });
      },
      error: (e) => console.error('Error loading subjects:', e),
    });
  }

  protected get selectedSubject(): SubjectResponseDto | null {
    const id = this.form.controls['subjectId'].value;
    return id ? this.subjects().find((s) => s.subjectId === id) ?? null : null;
  }

  protected onSubmit(): void {
    const subjectId = this.form.controls['subjectId'].value;
    if (!subjectId) return;

    this.apiService.deleteSubject(subjectId).subscribe({
      next: () => {
        this.form.reset();
        this.closeDialog();
      },
      error: (e) => console.error('Error deleting subject:', e),
    });
  }
}
