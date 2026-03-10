import { Component, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from 'src/app/api/api.service';
import { AbstractDialog } from 'src/app/common/dialog/abstract-dialog';

@Component({
  selector: 'app-create-subject',
  imports: [ReactiveFormsModule],
  templateUrl: './create-subject.html',
  styleUrl: './create-subject.css',
})
export class CreateSubject extends AbstractDialog {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected form: FormGroup = this.formBuilder.group({
    name: this.formBuilder.control<string>(''),
    description: this.formBuilder.control<string>(''),
  });

  protected errorMessage = '';

  protected onSubmit() {
    this.errorMessage = '';
    if (this.form.invalid) {
      return;
    }

    const name = this.form.controls['name'].value?.trim() ?? '';
    const description = this.form.controls['description'].value?.trim() ?? '';
    if (!name || !description) {
      this.errorMessage = 'Name and description are required.';
      return;
    }

    this.apiService.createSubject({ name, description }).subscribe({
      next: (response) => {
        console.log('Subject created successfully:', response);
        this.form.reset();
        this.closeDialog();
      },
      error: (err: { error?: { message?: string }; message?: string }) => {
        console.error('Error creating subject:', err);
        this.errorMessage = err?.error?.message ?? err?.message ?? 'Failed to create subject.';
      },
    });
  }
}
