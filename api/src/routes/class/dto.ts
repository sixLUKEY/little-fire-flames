/**
 * Data Transfer Objects for Class routes
 */

// Request DTOs
export interface CreateClassDto {
  name: string;
  teacherId: string;
  subjectIds?: string[]; // Optional: subjects to assign to this class
}

export interface UpdateClassDto {
  name?: string;
  teacherId?: string;
  learnerIds?: string[];
}

export interface DeleteClassDto {
  classId: string;
}

export interface GetClassDto {
  classId?: string;
}

// Response DTOs
export interface ClassResponseDto {
  classId: string;
  name: string;
  teacherId: string;
}

export interface ClassListResponseDto {
  data: ClassResponseDto[];
}
