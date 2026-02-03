import { Component, inject, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../api/api.service';
import { LearnerResponseDto } from '@api/types';

@Component({
  selector: 'lff-report-centre',
  imports: [ReactiveFormsModule],
  templateUrl: './report-centre.html',
  styleUrl: './report-centre.css',
})
export class ReportCentre {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected student = signal<LearnerResponseDto | null>(null);
  protected studentData = signal<string>('');

  protected form: FormGroup = this.formBuilder.group({
    studentId: this.formBuilder.control<string>(''),
  });

  protected onSubmit(event: Event) {
    event.preventDefault();

    if (this.form.invalid) {
      return;
    }

    const studentId = this.form.controls['studentId'].value;

    this.apiService.getLearners(studentId).subscribe({
      next: (response) => {
        console.log('Found Learner:', response);
        if (response.data && response.data.length > 0) {
          this.student.set(response.data[0]);
          this.studentData.set(JSON.stringify(response.data[0], null, 2));
        } else {
          this.student.set(null);
          this.studentData.set('No learner found with the provided ID.');
        }
      },
      error: (error) => {
        console.error('Error finding learner:', error);
        this.student.set(null);
        this.studentData.set(`Error: ${JSON.stringify(error, null, 2)}`);
      }
    });
  }

  protected clearLearner() {
    this.student.set(null);
    this.studentData.set('');
  }
}
