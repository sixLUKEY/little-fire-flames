import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { DialogService } from '../../common/dialog/dialog.service';
import { TeacherListResponseDto } from '@api/types';

@Component({
  selector: 'app-teachers',
  imports: [],
  templateUrl: './teachers.html',
  styleUrl: './teachers.css',
})
export class Teachers {
  private readonly apiService = inject(ApiService);
  protected textToDisplay = signal<string>('');
  protected readonly dialogService = inject(DialogService);

  protected displayEntity(id?: string): void {
    this.apiService.getTeachers(id).subscribe({
      next: (response: TeacherListResponseDto) => {
        this.textToDisplay.set(JSON.stringify(response, null, 2));
        console.log('teachers fetched:', response);
      },
      error: (error: unknown) => {
        console.error('Error fetching teachers:', error);
        this.textToDisplay.set(`Error: ${JSON.stringify(error, null, 2)}`);
      },
    });
  }
}
