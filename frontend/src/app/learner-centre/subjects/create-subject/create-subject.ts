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

  protected onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.apiService.createSubject({
      name: this.form.controls['name'].value,
      description: this.form.controls['description'].value,
    }).subscribe({
      next: (response) => {
        console.log('Subject created successfully:', response);
        this.form.reset();
        this.closeDialog();
      },
      error: (error) => {
        console.error('Error creating subject:', error);
      }
    });
  }
}
