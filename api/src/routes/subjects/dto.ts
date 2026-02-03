/**
 * Data Transfer Objects for Subject routes
 */

// Request DTOs
export interface CreateSubjectDto {
  name: string;
  description: string;
  subjectId?: string; // Optional, will be auto-generated if not provided
}

export interface UpdateSubjectDto {
  name?: string;
  description?: string;
}

export interface DeleteSubjectDto {
  subjectId: string;
}

export interface GetSubjectDto {
  subjectId?: string;
}

// Response DTOs
export interface SubjectResponseDto {
  name: string;
  description: string;
  subjectId: string;
}

export interface SubjectListResponseDto {
  data: SubjectResponseDto[];
}
