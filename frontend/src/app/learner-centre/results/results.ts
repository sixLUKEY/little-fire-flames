import { Component, inject, OnInit, signal, computed } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  FormArray,
  FormControl,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api/api.service';
import { getTermLabel, getYearsAvailable } from './term-periods';
import type {
  ClassResponseDto,
  LearnerResponseDto,
  SubjectResponseDto,
  SubjectResults,
  TermResultEntry,
} from '@api/types';

@Component({
  selector: 'app-results',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class Results implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected classes = signal<ClassResponseDto[]>([]);
  protected selectedClass = signal<ClassResponseDto | null>(null);
  protected learners = signal<LearnerResponseDto[]>([]);
  protected selectedLearner = signal<LearnerResponseDto | null>(null);
  protected classSubjects = signal<SubjectResponseDto[]>([]);
  protected loading = signal<boolean>(false);
  protected currentYear = new Date().getFullYear();
  protected yearsAvailable = getYearsAvailable();
  protected getTermLabel = getTermLabel;

  /** Signals for selected term/year so computed() reacts when they change. */
  protected selectedTerm = signal<number>(1);
  protected selectedYear = signal<number>(this.currentYear);

  protected form: FormGroup = this.formBuilder.group({
    classId: this.formBuilder.control<string>(''),
    studentId: this.formBuilder.control<string>(''),
    term: this.formBuilder.control<number>(1),
    year: this.formBuilder.control<number>(this.currentYear),
    results: this.formBuilder.array<FormGroup>([]),
  });

  /** Match term/year regardless of stored type (number vs string from API/form). */
  private sameTermYear(e: { term: number; year: number }, term: number, year: number): boolean {
    return Number(e.term) === Number(term) && Number(e.year) === Number(year);
  }

  protected selectedTermEntry = computed(() => {
    const learner = this.selectedLearner();
    const term = Number(this.selectedTerm());
    const year = Number(this.selectedYear());
    if (!learner?.termResults?.length) return null;
    return learner.termResults.find((e) => this.sameTermYear(e, term, year)) ?? null;
  });

  protected isPublished = computed(() => this.selectedTermEntry()?.status === 'published');

  ngOnInit() {
    this.loadClasses();
  }

  protected loadClasses() {
    this.loading.set(true);
    this.apiService.getClasses().subscribe({
      next: (response) => {
        this.classes.set(response.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected onClassSelected() {
    const classId = this.form.controls['classId'].value;
    if (!classId) {
      this.selectedClass.set(null);
      this.learners.set([]);
      this.selectedLearner.set(null);
      this.classSubjects.set([]);
      this.clearResultsForm();
      this.form.controls['studentId'].setValue('');
      return;
    }
    this.selectedClass.set(this.classes().find((c) => c.classId === classId) ?? null);
    this.selectedLearner.set(null);
    this.form.controls['studentId'].setValue('');
    this.clearResultsForm();
    this.loadLearnersForClass(classId);
    this.loadSubjects();
  }

  protected loadLearnersForClass(classId: string) {
    this.loading.set(true);
    this.apiService.getLearners().subscribe({
      next: (response) => {
        this.learners.set(response.data.filter((l) => l.classId === classId));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected loadSubjects() {
    const selected = this.selectedClass();
    const subjectIds = selected?.subjectIds;
    this.apiService.getSubjects().subscribe({
      next: (response) => {
        const subjects =
          subjectIds?.length
            ? response.data.filter((s) => subjectIds.includes(s.subjectId))
            : response.data;
        this.classSubjects.set(subjects);
        this.syncResultsFormToTerm();
      },
      error: () => {},
    });
  }

  protected onLearnerSelected() {
    const studentId = this.form.controls['studentId'].value;
    if (!studentId) {
      this.selectedLearner.set(null);
      this.clearResultsForm();
      return;
    }
    const learner = this.learners().find((l) => l.studentId === studentId) ?? null;
    this.selectedLearner.set(learner);
    this.syncResultsFormToTerm();
  }

  protected onTermOrYearChange() {
    const term = Number(this.form.controls['term'].value);
    const year = Number(this.form.controls['year'].value);
    this.selectedTerm.set(term);
    this.selectedYear.set(year);
    this.form.patchValue({ term, year });
    this.syncResultsFormToTerm();
  }

  protected syncResultsFormToTerm() {
    const learner = this.selectedLearner();
    const term = Number(this.selectedTerm());
    const year = Number(this.selectedYear());
    const entry = learner?.termResults?.find((e) => this.sameTermYear(e, term, year));
    const subjects = this.classSubjects();
    this.initializeResultsForm(entry?.subjects ?? [], subjects);
  }

  protected initializeResultsForm(
    existingResults: SubjectResults[] = [],
    subjects?: SubjectResponseDto[]
  ) {
    const subs = subjects ?? this.classSubjects();
    const resultsArray = this.form.get('results') as FormArray;
    resultsArray.clear();
    subs.forEach((subject) => {
      const existing = existingResults.find((r) => r.name === subject.name);
      const resultGroup = this.formBuilder.group({
        subjectId: this.formBuilder.control<string>(subject.subjectId),
        name: this.formBuilder.control<string>(subject.name),
        result: this.formBuilder.control<number>(existing?.result ?? 0, [
          Validators.min(0),
          Validators.max(7),
        ]),
        feedback: this.formBuilder.control<string>(existing?.feedback ?? ''),
      });
      resultsArray.push(resultGroup);
    });
  }

  protected clearResultsForm() {
    (this.form.get('results') as FormArray).clear();
  }

  protected get resultsArray(): FormArray {
    return this.form.get('results') as FormArray;
  }

  protected getResultGroup(index: number): FormGroup {
    return this.resultsArray.at(index) as FormGroup;
  }

  protected getResultControl(index: number): FormControl<number> {
    return this.getResultGroup(index).controls['result'] as FormControl<number>;
  }

  protected getFeedbackControl(index: number): FormControl<string> {
    return this.getResultGroup(index).controls['feedback'] as FormControl<string>;
  }

  protected saveAsDraft() {
    this.saveTermResults('draft');
  }

  protected publish() {
    this.saveTermResults('published');
  }

  private saveTermResults(status: 'draft' | 'published') {
    const learner = this.selectedLearner();
    if (!learner || this.form.invalid) return;

    const term = Number(this.form.controls['term'].value);
    const year = Number(this.form.controls['year'].value);
    const existing = learner.termResults ?? [];
    const entry = existing.find((e) => this.sameTermYear(e, term, year));
    if (entry?.status === 'published') {
      return;
    }

    const formResults = this.resultsArray.value as Array<{
      subjectId: string;
      name: string;
      result: number;
      feedback: string;
    }>;
    const subjects: SubjectResults[] = formResults.map((r) => ({
      name: r.name,
      result: Number(r.result) ?? 0,
      feedback: r.feedback ?? '',
    }));

    const newEntry: TermResultEntry = { term, year, status, subjects };
    const merged: TermResultEntry[] = existing.filter(
      (e) => !this.sameTermYear(e, term, year)
    );
    merged.push(newEntry);
    merged.sort((a, b) => Number(a.year) - Number(b.year) || Number(a.term) - Number(b.term));

    this.apiService.updateLearner(learner.studentId, { termResults: merged }).subscribe({
      next: () => {
        const updatedLearner: LearnerResponseDto = { ...learner, termResults: merged };
        this.selectedLearner.set(updatedLearner);
        this.learners.update((list) =>
          list.map((l) => (l.studentId === learner.studentId ? updatedLearner : l))
        );
        this.syncResultsFormToTerm();
      },
      error: (err) => console.error('Failed to save results', err),
    });
  }
}
