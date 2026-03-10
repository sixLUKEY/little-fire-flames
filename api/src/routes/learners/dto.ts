/**
 * Data Transfer Objects for Learner routes
 */

export interface SubjectResults {
  name: string;
  result: number;
  feedback: string;
}

export type ResultStatus = 'draft' | 'published';

/** Results for one term. Once published, ineditable. */
export interface TermResultEntry {
  term: number;
  year: number;
  status: ResultStatus;
  subjects: SubjectResults[];
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
  termResults?: TermResultEntry[];
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
  termResults: TermResultEntry[];
}

export interface LearnerListResponseDto {
  data: LearnerResponseDto[];
}
