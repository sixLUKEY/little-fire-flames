import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/api/api.service';
import { DialogService } from 'src/app/common/dialog/dialog.service';
import { AbstractDialog } from 'src/app/common/dialog/abstract-dialog';
import type { ClassResponseDto, SubjectResponseDto, TeacherResponseDto } from '@api/types';

@Component({
  selector: 'app-update-class',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-class.html',
  styleUrl: './update-class.css',
})
export class UpdateClass extends AbstractDialog implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly dialogService = inject(DialogService);

  protected classes = signal<ClassResponseDto[]>([]);
  protected subjects = signal<SubjectResponseDto[]>([]);
  protected teachers = signal<TeacherResponseDto[]>([]);

  protected form: FormGroup = this.formBuilder.group({
    classId: this.formBuilder.control<string>(''),
    name: this.formBuilder.control<string>(''),
    teacherId: this.formBuilder.control<string>(''),
    subjectIds: this.formBuilder.array<FormControl<boolean>>([]),
  });

  ngOnInit() {
    this.apiService.getClasses().subscribe({
      next: (r) => {
        this.classes.set(r.data);
        const initialId = this.dialogService.getInitialEntityId();
        if (initialId) {
          this.form.patchValue({ classId: initialId });
          this.onClassSelected();
        }
      },
      error: (e) => console.error('Error loading classes:', e),
    });
    this.apiService.getSubjects().subscribe({
      next: (r) => {
        this.subjects.set(r.data);
        const arr = this.subjectIdsArray;
        arr.clear();
        r.data.forEach(() => arr.push(this.formBuilder.control(false)));
        const initialId = this.dialogService.getInitialEntityId();
        if (initialId && this.form.controls['classId'].value) this.onClassSelected();
      },
      error: (e) => console.error('Error loading subjects:', e),
    });
    this.apiService.getTeachers().subscribe({
      next: (r) => this.teachers.set(r.data),
      error: (e) => console.error('Error loading teachers:', e),
    });
  }

  protected get subjectIdsArray(): FormArray {
    return this.form.get('subjectIds') as FormArray;
  }

  protected getSubjectControl(index: number): FormControl<boolean> {
    return this.subjectIdsArray.at(index) as FormControl<boolean>;
  }

  protected onClassSelected(): void {
    const id = this.form.controls['classId'].value;
    const cls = this.classes().find((c) => c.classId === id);
    if (!cls) return;
    this.form.patchValue({ name: cls.name, teacherId: cls.teacherId });
    const ids = cls.subjectIds ?? [];
    const arr = this.subjectIdsArray;
    if (arr.length === this.subjects().length) {
      this.subjects().forEach((s, i) => {
        (arr.at(i) as FormControl<boolean>).setValue(ids.includes(s.subjectId));
      });
    }
  }

  protected onSubmit(): void {
    const classId = this.form.controls['classId'].value;
    if (!classId) return;

    const selectedSubjectIds = this.subjectIdsArray.controls
      .map((ctrl, i) => (ctrl.value ? this.subjects()[i].subjectId : null))
      .filter((id): id is string => id !== null);

    this.apiService
      .updateClass(classId, {
        name: this.form.controls['name'].value || undefined,
        teacherId: this.form.controls['teacherId'].value || undefined,
        subjectIds: selectedSubjectIds,
      })
      .subscribe({
        next: () => {
          this.form.reset();
          this.closeDialog();
        },
        error: (e) => console.error('Error updating class:', e),
      });
  }
}
