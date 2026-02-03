import { Component, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from 'src/app/api/api.service';
import { AbstractDialog } from 'src/app/common/dialog/abstract-dialog';

@Component({
  selector: 'app-delete-teacher',
  imports: [ReactiveFormsModule],
  templateUrl: './delete-teacher.html',
  styleUrl: './delete-teacher.css',
})
export class DeleteTeacher extends AbstractDialog {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected form: FormGroup = this.formBuilder.group({
    teacherId: this.formBuilder.control<string>(''),
  });

  protected onSubmit() {
    if (this.form.invalid || !this.form.controls['teacherId'].value) {
      return;
    }

    this.apiService.deleteTeacher(this.form.controls['teacherId'].value).subscribe({
      next: (response) => {
        console.log('Teacher deleted successfully:', response);
        this.form.reset();
        this.closeDialog();
      },
      error: (error) => {
        console.error('Error deleting teacher:', error);
      }
    });
  }
}
