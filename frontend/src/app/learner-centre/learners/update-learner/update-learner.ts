import { Component, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from 'src/app/api/api.service';
import { AbstractDialog } from 'src/app/common/dialog/abstract-dialog';

@Component({
  selector: 'app-update-learner',
  imports: [ReactiveFormsModule],
  templateUrl: './update-learner.html',
  styleUrl: './update-learner.css',
})
export class UpdateLearner extends AbstractDialog {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected form: FormGroup = this.formBuilder.group({
    studentId: this.formBuilder.control<string>(''),
    name: this.formBuilder.control<string>(''),
    classId: this.formBuilder.control<string>(''),
  });

  protected onSubmit() {
    if (this.form.invalid || !this.form.controls['studentId'].value) {
      return;
    }

    this.apiService.updateLearner(
      this.form.controls['studentId'].value,
      {
        name: this.form.controls['name'].value || undefined,
        classId: this.form.controls['classId'].value || undefined,
      }
    ).subscribe({
      next: (response) => {
        console.log('Learner updated successfully:', response);
        this.form.reset();
        this.closeDialog();
      },
      error: (error) => {
        console.error('Error updating learner:', error);
      }
    });
  }
}
