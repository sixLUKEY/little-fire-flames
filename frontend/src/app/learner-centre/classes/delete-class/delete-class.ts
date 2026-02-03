import { Component, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from 'src/app/api/api.service';
import { AbstractDialog } from 'src/app/common/dialog/abstract-dialog';

@Component({
  selector: 'app-delete-class',
  imports: [ReactiveFormsModule],
  templateUrl: './delete-class.html',
  styleUrl: './delete-class.css',
})
export class DeleteClass extends AbstractDialog {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected form: FormGroup = this.formBuilder.group({
    classId: this.formBuilder.control<string>(''),
  });

  protected onSubmit() {
    if (this.form.invalid || !this.form.controls['classId'].value) {
      return;
    }

    this.apiService.deleteClass(this.form.controls['classId'].value).subscribe({
      next: (response) => {
        console.log('Class deleted successfully:', response);
        this.form.reset();
        this.closeDialog();
      },
      error: (error) => {
        console.error('Error deleting class:', error);
      }
    });
  }
}
