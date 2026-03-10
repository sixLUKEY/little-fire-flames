import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api/api.service';
import { DialogService } from '../../common/dialog/dialog.service';
import type { ClassResponseDto } from '@api/types';

@Component({
  selector: 'app-classes',
  imports: [FormsModule],
  templateUrl: './classes.html',
  styleUrl: './classes.css',
})
export class Classes implements OnInit {
  private readonly apiService = inject(ApiService);
  protected readonly dialogService = inject(DialogService);

  protected entities = signal<ClassResponseDto[]>([]);
  protected selectedId = signal<string>('');

  ngOnInit(): void {
    this.apiService.getClasses().subscribe({
      next: (response) => this.entities.set(response.data),
      error: (err) => console.error('Error fetching classes:', err),
    });
  }

  protected openUpdate(classId: string): void {
    this.dialogService.show('updateClass', classId);
  }

  protected openDelete(classId: string): void {
    this.dialogService.show('deleteClass', classId);
  }
}
