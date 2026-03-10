import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api/api.service';
import { DialogService } from '../../common/dialog/dialog.service';
import type { TeacherResponseDto } from '@api/types';

@Component({
  selector: 'app-teachers',
  imports: [FormsModule],
  templateUrl: './teachers.html',
  styleUrl: './teachers.css',
})
export class Teachers implements OnInit {
  private readonly apiService = inject(ApiService);
  protected readonly dialogService = inject(DialogService);

  protected entities = signal<TeacherResponseDto[]>([]);
  protected selectedId = signal<string>('');

  ngOnInit(): void {
    this.apiService.getTeachers().subscribe({
      next: (response) => this.entities.set(response.data),
      error: (err) => console.error('Error fetching teachers:', err),
    });
  }

  protected openUpdate(teacherId: string): void {
    this.dialogService.show('updateTeacher', teacherId);
  }

  protected openDelete(teacherId: string): void {
    this.dialogService.show('deleteTeacher', teacherId);
  }
}
