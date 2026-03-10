/**
 * Data Transfer Objects for Teacher routes
 */

// Request DTOs — teachers are not assigned classes; classes are assigned teachers. classId is optional.
export interface CreateTeacherDto {
  name: string;
  description: string;
  classId?: string | null;
}

export interface UpdateTeacherDto {
  name?: string;
  description?: string;
  classId?: string | null;
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
  classId: string | null;
}

export interface TeacherListResponseDto {
  data: TeacherResponseDto[];
}
