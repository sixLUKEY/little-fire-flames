import { Component, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from 'src/app/api/api.service';
import { AbstractDialog } from 'src/app/common/dialog/abstract-dialog';

@Component({
  selector: 'app-update-teacher',
  imports: [ReactiveFormsModule],
  templateUrl: './update-teacher.html',
  styleUrl: './update-teacher.css',
})
export class UpdateTeacher extends AbstractDialog {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected form: FormGroup = this.formBuilder.group({
    teacherId: this.formBuilder.control<string>(''),
    name: this.formBuilder.control<string>(''),
    description: this.formBuilder.control<string>(''),
    subjectId: this.formBuilder.control<string>(''),
  });

  protected onSubmit() {
    if (this.form.invalid || !this.form.controls['teacherId'].value) {
      return;
    }

    this.apiService.updateTeacher(
      this.form.controls['teacherId'].value,
      {
        name: this.form.controls['name'].value || undefined,
        description: this.form.controls['description'].value || undefined,
        subjectId: this.form.controls['subjectId'].value || undefined,
      }
    ).subscribe({
      next: (response) => {
        console.log('Teacher updated successfully:', response);
        this.form.reset();
        this.closeDialog();
      },
      error: (error) => {
        console.error('Error updating teacher:', error);
      }
    });
  }
}
