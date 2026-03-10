import { Component, inject, signal, computed } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api/api.service';
import { getTermLabel } from '../learner-centre/results/term-periods';
import type { LearnerResponseDto, SubjectResults } from '@api/types';

@Component({
  selector: 'app-parents-corner',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './parents-corner.html',
  styleUrl: './parents-corner.css',
})
export class ParentsCorner {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected student = signal<LearnerResponseDto | null>(null);
  protected loading = signal<boolean>(false);
  protected notFound = signal<boolean>(false);
  protected selectedTerm = signal<number>(1);
  protected selectedYear = signal<number>(new Date().getFullYear());
  protected getTermLabel = getTermLabel;

  protected form: FormGroup = this.formBuilder.group({
    studentId: this.formBuilder.control<string>(''),
  });

  /** Published term results for the current student, sorted by year then term. */
  protected publishedTermResults = computed(() => {
    const s = this.student();
    const list = (s?.termResults ?? []).filter((e) => e.status === 'published');
    return list.sort((a, b) => a.year - b.year || a.term - b.term);
  });

  /** Currently selected term entry (published only) for the selected term/year. */
  protected currentTermEntry = computed(() => {
    const list = this.publishedTermResults();
    const term = this.selectedTerm();
    const year = this.selectedYear();
    return list.find((e) => e.term === term && e.year === year) ?? null;
  });

  /** All term+year options that have published results, for quick navigation. */
  protected publishedTermOptions = computed(() => {
    return this.publishedTermResults().map((e) => ({ term: e.term, year: e.year }));
  });

  protected currentYear = new Date().getFullYear();

  protected onSubmit(event: Event) {
    event.preventDefault();
    if (this.form.invalid) return;

    const studentId = this.form.controls['studentId'].value?.trim();
    if (!studentId) return;

    this.notFound.set(false);
    this.loading.set(true);
    this.student.set(null);

    this.apiService.getLearners(studentId).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.data?.length) {
          const learner = response.data[0];
          this.student.set(learner);
          const published = (learner.termResults ?? []).filter((e) => e.status === 'published');
          if (published.length) {
            const last = published[published.length - 1];
            this.selectedTerm.set(last.term);
            this.selectedYear.set(last.year);
          }
        } else {
          this.notFound.set(true);
        }
      },
      error: () => {
        this.loading.set(false);
        this.notFound.set(true);
      },
    });
  }

  protected viewAnotherStudent() {
    this.student.set(null);
    this.notFound.set(false);
    this.form.controls['studentId'].setValue('');
  }

  protected selectTerm(term: number, year: number) {
    this.selectedTerm.set(term);
    this.selectedYear.set(year);
  }

  protected overallProgress(subjects: SubjectResults[]): string {
    if (!subjects?.length) return '—';
    const avg = subjects.reduce((sum, r) => sum + (r.result ?? 0), 0) / subjects.length;
    if (avg >= 75) return 'Good';
    if (avg >= 50) return 'Satisfactory';
    return 'Needs attention';
  }
}
