/**
 * Data Transfer Objects for Learner routes
 */

export interface SubjectResults {
  name: string;
  result: number;
  feedback: string;
}

// Request DTOs
export interface CreateLearnerDto {
  name: string;
  classId: string;
  studentId: string;
}

export interface UpdateLearnerDto {
  name?: string;
  classId?: string;
  results?: SubjectResults[];
}

export interface DeleteLearnerDto {
  studentId: string;
}

export interface GetLearnerDto {
  studentId?: string;
}

// Response DTOs
export interface LearnerResponseDto {
  name: string;
  studentId: string;
  classId: string;
  results: SubjectResults[];
}

export interface LearnerListResponseDto {
  data: LearnerResponseDto[];
}
