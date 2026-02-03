import { Component, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from 'src/app/api/api.service';
import { AbstractDialog } from 'src/app/common/dialog/abstract-dialog';

@Component({
  selector: 'app-delete-learner',
  imports: [ReactiveFormsModule],
  templateUrl: './delete-learner.html',
  styleUrl: './delete-learner.css',
})
export class DeleteLearner extends AbstractDialog {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected form: FormGroup = this.formBuilder.group({
    studentId: this.formBuilder.control<string>(''),
  });

  protected onSubmit() {
    if (this.form.invalid || !this.form.controls['studentId'].value) {
      return;
    }

    this.apiService.deleteLearner(this.form.controls['studentId'].value).subscribe({
      next: (response) => {
        console.log('Learner deleted successfully:', response);
        this.form.reset();
        this.closeDialog();
      },
      error: (error) => {
        console.error('Error deleting learner:', error);
      }
    });
  }
}
