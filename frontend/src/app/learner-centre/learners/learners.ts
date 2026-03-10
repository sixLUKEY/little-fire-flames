import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api/api.service';
import { DialogService } from '../../common/dialog/dialog.service';
import type { LearnerResponseDto } from '@api/types';

@Component({
  selector: 'app-learners',
  imports: [FormsModule],
  templateUrl: './learners.html',
  styleUrl: './learners.css',
})
export class Learners implements OnInit {
  private readonly apiService = inject(ApiService);
  protected readonly dialogService = inject(DialogService);

  protected entities = signal<LearnerResponseDto[]>([]);
  protected selectedId = signal<string>('');

  ngOnInit(): void {
    this.apiService.getLearners().subscribe({
      next: (response) => this.entities.set(response.data),
      error: (err) => console.error('Error fetching learners:', err),
    });
  }

  protected openUpdate(studentId: string): void {
    this.dialogService.show('updateLearner', studentId);
  }

  protected openDelete(studentId: string): void {
    this.dialogService.show('deleteLearner', studentId);
  }
}
