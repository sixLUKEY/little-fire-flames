import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { DialogService } from '../../common/dialog/dialog.service';
import { ClassListResponseDto } from '@api/types';

@Component({
  selector: 'app-classes',
  imports: [],
  templateUrl: './classes.html',
  styleUrl: './classes.css',
})
export class Classes {
  private readonly apiService = inject(ApiService);
  protected textToDisplay = signal<string>('');
  protected readonly dialogService = inject(DialogService);

  protected displayEntity(id?: string): void {
    this.apiService.getClasses(id).subscribe({
      next: (response: ClassListResponseDto) => {
        this.textToDisplay.set(JSON.stringify(response, null, 2));
        console.log('classes fetched:', response);
      },
      error: (error: unknown) => {
        console.error('Error fetching classes:', error);
        this.textToDisplay.set(`Error: ${JSON.stringify(error, null, 2)}`);
      },
    });
  }
}
