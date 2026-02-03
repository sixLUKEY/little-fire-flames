import { Component, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from 'src/app/api/api.service';
import { AbstractDialog } from 'src/app/common/dialog/abstract-dialog';

@Component({
  selector: 'app-update-class',
  imports: [ReactiveFormsModule],
  templateUrl: './update-class.html',
  styleUrl: './update-class.css',
})
export class UpdateClass extends AbstractDialog {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected form: FormGroup = this.formBuilder.group({
    classId: this.formBuilder.control<string>(''),
    name: this.formBuilder.control<string>(''),
    teacherId: this.formBuilder.control<string>(''),
  });

  protected onSubmit() {
    if (this.form.invalid || !this.form.controls['classId'].value) {
      return;
    }

    this.apiService.updateClass(
      this.form.controls['classId'].value,
      {
        name: this.form.controls['name'].value || undefined,
        teacherId: this.form.controls['teacherId'].value || undefined,
      }
    ).subscribe({
      next: (response) => {
        console.log('Class updated successfully:', response);
        this.form.reset();
        this.closeDialog();
      },
      error: (error) => {
        console.error('Error updating class:', error);
      }
    });
  }
}
