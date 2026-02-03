import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { DialogService } from '../../common/dialog/dialog.service';
import { LearnerListResponseDto } from '@api/types';

@Component({
  selector: 'app-learners',
  imports: [],
  templateUrl: './learners.html',
  styleUrl: './learners.css',
})
export class Learners {
  private readonly apiService = inject(ApiService);
  protected textToDisplay = signal<string>('');
  protected readonly dialogService = inject(DialogService);

  protected displayEntity(id?: string): void {
    this.apiService.getLearners(id).subscribe({
      next: (response: LearnerListResponseDto) => {
        this.textToDisplay.set(JSON.stringify(response, null, 2));
        console.log('learners fetched:', response);
      },
      error: (error: unknown) => {
        console.error('Error fetching learners:', error);
        this.textToDisplay.set(`Error: ${JSON.stringify(error, null, 2)}`);
      },
    });
  }
}
