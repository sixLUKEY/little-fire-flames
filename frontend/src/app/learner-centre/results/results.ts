import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api/api.service';
import type {
  ClassResponseDto,
  LearnerResponseDto,
  SubjectResponseDto,
  SubjectResults,
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

  protected form: FormGroup = this.formBuilder.group({
    classId: this.formBuilder.control<string>(''),
    studentId: this.formBuilder.control<string>(''),
    results: this.formBuilder.array<FormGroup>([]),
  });

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
      error: (error) => {
        console.error('Error loading classes:', error);
        this.loading.set(false);
      }
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

    const selected = this.classes().find(c => c.classId === classId);
    this.selectedClass.set(selected || null);

    // Reset learner selection
    this.selectedLearner.set(null);
    this.form.controls['studentId'].setValue('');
    this.clearResultsForm();

    // Load learners for this class
    this.loadLearnersForClass(classId);

    // Load class subjects (from class.subjectIds if available, otherwise all subjects)
    // For now, we'll load all subjects. In the future, this should come from class.subjectIds
    this.loadSubjects();
  }

  protected loadLearnersForClass(classId: string) {
    this.loading.set(true);
    this.apiService.getLearners().subscribe({
      next: (response) => {
        // Filter learners by classId
        const classLearners = response.data.filter(l => l.classId === classId);
        this.learners.set(classLearners);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading learners:', error);
        this.loading.set(false);
      }
    });
  }

  protected loadSubjects() {
    this.apiService.getSubjects().subscribe({
      next: (response) => {
        // TODO: Filter by class.subjectIds when that relationship is stored
        // For now, show all subjects. When class.subjectIds is implemented,
        // filter: response.data.filter(s => selectedClass()?.subjectIds?.includes(s.subjectId))
        this.classSubjects.set(response.data);
        // Only initialize if a learner is already selected and subjects are loaded
        if (this.selectedLearner() && this.classSubjects().length > 0) {
          this.initializeResultsForm(this.selectedLearner()!.results || []);
        }
      },
      error: (error) => {
        console.error('Error loading subjects:', error);
      }
    });
  }

  protected onLearnerSelected() {
    const studentId = this.form.controls['studentId'].value;
    if (!studentId) {
      this.selectedLearner.set(null);
      this.clearResultsForm();
      return;
    }

    const learner = this.learners().find(l => l.studentId === studentId);
    this.selectedLearner.set(learner || null);

    if (learner) {
      this.loadLearnerResults(learner);
    }
  }

  protected loadLearnerResults(learner: LearnerResponseDto) {
    // Initialize form with existing results or empty results for each class subject
    // Only initialize if subjects are already loaded
    if (this.classSubjects().length > 0) {
      this.initializeResultsForm(learner.results || []);
    }
    // If subjects aren't loaded yet, they will initialize the form when they finish loading
  }

  protected initializeResultsForm(existingResults: SubjectResults[] = []) {
    const resultsArray = this.form.get('results') as FormArray;
    resultsArray.clear();

    this.classSubjects().forEach((subject) => {
      const existingResult = existingResults.find(r => r.name === subject.name);
      const resultValue = existingResult?.result ?? 0;
      const feedbackValue = existingResult?.feedback ?? '';
      
      const resultGroup = this.formBuilder.group({
        subjectId: this.formBuilder.control<string>(subject.subjectId),
        name: this.formBuilder.control<string>(subject.name),
        result: this.formBuilder.control<number>(resultValue),
        feedback: this.formBuilder.control<string>(feedbackValue),
      });
      resultsArray.push(resultGroup);
    });
    
    console.log('Form initialized with results:', this.resultsArray.value);
  }

  protected clearResultsForm() {
    const resultsArray = this.form.get('results') as FormArray;
    resultsArray.clear();
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

  protected onSubmit(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    if (this.form.invalid || !this.selectedLearner()) {
      console.warn('Form is invalid or no learner selected');
      return;
    }

    const studentId = this.selectedLearner()!.studentId;
    
    // Get form values directly from the form array
    const formResults = this.resultsArray.value as Array<{
      subjectId: string;
      name: string;
      result: number;
      feedback: string;
    }>;
    
    const results: SubjectResults[] = formResults.map(formResult => ({
      name: formResult.name,
      result: formResult.result !== null && formResult.result !== undefined ? Number(formResult.result) : 0,
      feedback: formResult.feedback || '',
    }));

    console.log('Form results array value:', this.resultsArray.value);
    console.log('Submitting results:', results);

    this.apiService.updateLearner(studentId, { results }).subscribe({
      next: (response) => {
        console.log('Results updated successfully:', response);
        // Reload learner data to show updated results
        const currentStudentId = this.form.controls['studentId'].value;
        this.apiService.getLearners(currentStudentId).subscribe({
          next: (learnerResponse) => {
            if (learnerResponse.data && learnerResponse.data.length > 0) {
              const updatedLearner = learnerResponse.data[0];
              this.selectedLearner.set(updatedLearner);
              this.learners.update(learners => 
                learners.map(l => l.studentId === updatedLearner.studentId ? updatedLearner : l)
              );
              this.initializeResultsForm(updatedLearner.results || []);
            }
          },
          error: (error) => {
            console.error('Error reloading learner:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error updating results:', error);
      }
    });
  }
}
