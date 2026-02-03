import { Component, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from 'src/app/api/api.service';
import { AbstractDialog } from 'src/app/common/dialog/abstract-dialog';

@Component({
  selector: 'app-update-subject',
  imports: [ReactiveFormsModule],
  templateUrl: './update-subject.html',
  styleUrl: './update-subject.css',
})
export class UpdateSubject extends AbstractDialog {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected form: FormGroup = this.formBuilder.group({
    subjectId: this.formBuilder.control<string>(''),
    name: this.formBuilder.control<string>(''),
    description: this.formBuilder.control<string>(''),
  });

  protected onSubmit() {
    if (this.form.invalid || !this.form.controls['subjectId'].value) {
      return;
    }

    this.apiService.updateSubject(
      this.form.controls['subjectId'].value,
      {
        name: this.form.controls['name'].value || undefined,
        description: this.form.controls['description'].value || undefined,
      }
    ).subscribe({
      next: (response) => {
        console.log('Subject updated successfully:', response);
        this.form.reset();
        this.closeDialog();
      },
      error: (error) => {
        console.error('Error updating subject:', error);
      }
    });
  }
}
