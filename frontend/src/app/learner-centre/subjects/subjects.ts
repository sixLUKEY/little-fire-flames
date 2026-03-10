import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api/api.service';
import { DialogService } from '../../common/dialog/dialog.service';
import type { SubjectResponseDto } from '@api/types';

@Component({
  selector: 'app-subjects',
  imports: [FormsModule],
  templateUrl: './subjects.html',
  styleUrl: './subjects.css',
})
export class Subjects implements OnInit {
  private readonly apiService = inject(ApiService);
  protected readonly dialogService = inject(DialogService);

  protected entities = signal<SubjectResponseDto[]>([]);
  protected selectedId = signal<string>('');

  ngOnInit(): void {
    this.apiService.getSubjects().subscribe({
      next: (response) => this.entities.set(response.data),
      error: (err) => console.error('Error fetching subjects:', err),
    });
  }

  protected openUpdate(subjectId: string): void {
    this.dialogService.show('updateSubject', subjectId);
  }

  protected openDelete(subjectId: string): void {
    this.dialogService.show('deleteSubject', subjectId);
  }
}
