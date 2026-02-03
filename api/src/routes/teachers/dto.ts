/**
 * Data Transfer Objects for Teacher routes
 */

// Request DTOs
export interface CreateTeacherDto {
  name: string;
  description: string;
  subjectId: string;
}

export interface UpdateTeacherDto {
  name?: string;
  description?: string;
  subjectId?: string;
}

export interface DeleteTeacherDto {
  teacherId: string;
}

export interface GetTeacherDto {
  teacherId?: string;
}

// Response DTOs
export interface TeacherResponseDto {
  teacherId: string;
  name: string;
  description: string;
  subjectId: string;
}

export interface TeacherListResponseDto {
  data: TeacherResponseDto[];
}
