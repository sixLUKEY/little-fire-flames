import { Component, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from 'src/app/api/api.service';
import { AbstractDialog } from 'src/app/common/dialog/abstract-dialog';

@Component({
  selector: 'app-delete-subject',
  imports: [ReactiveFormsModule],
  templateUrl: './delete-subject.html',
  styleUrl: './delete-subject.css',
})
export class DeleteSubject extends AbstractDialog {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected form: FormGroup = this.formBuilder.group({
    subjectId: this.formBuilder.control<string>(''),
  });

  protected onSubmit() {
    if (this.form.invalid || !this.form.controls['subjectId'].value) {
      return;
    }

    this.apiService.deleteSubject(this.form.controls['subjectId'].value).subscribe({
      next: (response) => {
        console.log('Subject deleted successfully:', response);
        this.form.reset();
        this.closeDialog();
      },
      error: (error) => {
        console.error('Error deleting subject:', error);
      }
    });
  }
}
