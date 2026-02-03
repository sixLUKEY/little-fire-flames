// Re-export all shared types for frontend consumption

import { ClassListResponseDto, ClassResponseDto, CreateClassDto, UpdateClassDto } from '../routes/class/dto';
import { CreateLearnerDto, LearnerListResponseDto, LearnerResponseDto, SubjectResults, UpdateLearnerDto } from '../routes/learners/dto';
import { SubjectListResponseDto, SubjectResponseDto } from '../routes/subjects/dto';
import { TeacherListResponseDto, TeacherResponseDto } from '../routes/teachers/dto';

// Base types
export type { HttpMethod, Params, V1RequestOptions, HttpRawResponse } from '../types';

// Re-export DTO types from backend
export type {
  SubjectResults,
  CreateLearnerDto,
  UpdateLearnerDto,
  DeleteLearnerDto,
  GetLearnerDto,
  LearnerResponseDto,
  LearnerListResponseDto,
} from '../routes/learners/dto';

export type {
  CreateClassDto,
  UpdateClassDto,
  DeleteClassDto,
  GetClassDto,
  ClassResponseDto,
  ClassListResponseDto,
} from '../routes/class/dto';

export type {
  CreateSubjectDto,
  UpdateSubjectDto,
  DeleteSubjectDto,
  GetSubjectDto,
  SubjectResponseDto,
  SubjectListResponseDto,
} from '../routes/subjects/dto';

export type {
  CreateTeacherDto,
  UpdateTeacherDto,
  DeleteTeacherDto,
  GetTeacherDto,
  TeacherResponseDto,
  TeacherListResponseDto,
} from '../routes/teachers/dto';

// Database model types (matching backend response DTOs)
export interface LearnerModel {
  name: string;
  studentId: string;
  classId: string;
  results: SubjectResults[];
}

export interface ClassModel {
  classId: string;
  name: string;
  teacherId: string;
}

export interface SubjectModel {
  name: string;
  description: string;
  subjectId: string;
}

export interface TeacherModel {
  teacherId: string;
  name: string;
  description: string;
  subjectId: string;
}

// Legacy request types (aliases for backward compatibility)
export type CreateLearnerRequest = CreateLearnerDto;
export type UpdateLearnerRequest = UpdateLearnerDto;
export type CreateClassRequest = CreateClassDto;
export type UpdateClassRequest = UpdateClassDto;

// API Response types
// Note: The backend returns only the body part via Express, not the full HttpRawResponse
// The HTTP status code is in the response status, not in the body
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
}

// Success response for create/update/delete operations
export interface ApiSuccessResponse {
  message: string;
}

// Error response
export interface ApiErrorResponse {
  message: string;
  error?: string;
}

// Specific response types (matching backend response DTOs)
export type LearnersResponse = LearnerListResponseDto;
export type LearnerResponse = { data: LearnerResponseDto };
export type ClassesResponse = ClassListResponseDto;
export type ClassResponse = { data: ClassResponseDto };
export type SubjectsResponse = SubjectListResponseDto;
export type SubjectResponse = { data: SubjectResponseDto };
export type TeachersResponse = TeacherListResponseDto;
export type TeacherResponse = { data: TeacherResponseDto };
