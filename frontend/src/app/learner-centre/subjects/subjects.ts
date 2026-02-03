import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { DialogService } from '../../common/dialog/dialog.service';
import { SubjectListResponseDto } from '@api/types';

@Component({
  selector: 'app-subjects',
  imports: [],
  templateUrl: './subjects.html',
  styleUrl: './subjects.css',
})
export class Subjects {
  private readonly apiService = inject(ApiService);
  protected textToDisplay = signal<string>('');
  protected readonly dialogService = inject(DialogService);

  protected displayEntity(id?: string): void {
    this.apiService.getSubjects(id).subscribe({
      next: (response: SubjectListResponseDto) => {
        this.textToDisplay.set(JSON.stringify(response, null, 2));
        console.log('subjects fetched:', response);
      },
      error: (error: unknown) => {
        console.error('Error fetching subjects:', error);
        this.textToDisplay.set(`Error: ${JSON.stringify(error, null, 2)}`);
      },
    });
  }
}
