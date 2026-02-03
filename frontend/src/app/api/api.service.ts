import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type {
  // Models
  LearnerModel,
  ClassModel,
  SubjectModel,
  TeacherModel,
  // Request DTOs
  CreateLearnerDto,
  UpdateLearnerDto,
  DeleteLearnerDto,
  CreateClassDto,
  UpdateClassDto,
  DeleteClassDto,
  CreateSubjectDto,
  UpdateSubjectDto,
  DeleteSubjectDto,
  CreateTeacherDto,
  UpdateTeacherDto,
  DeleteTeacherDto,
  // Response DTOs
  LearnerListResponseDto,
  ClassListResponseDto,
  SubjectListResponseDto,
  TeacherListResponseDto,
  // Legacy types (for backward compatibility)
  CreateLearnerRequest,
  UpdateLearnerRequest,
  CreateClassRequest,
  UpdateClassRequest,
  ApiResponse,
} from '@api/types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  // ==================== LEARNERS ====================
  
  getLearners(studentId?: string): Observable<LearnerListResponseDto> {
    const url = studentId
      ? `${this.baseUrl}/v1/learners/${studentId}`
      : `${this.baseUrl}/v1/learners`;
    return this.http.get<LearnerListResponseDto>(url);
  }

  createLearner(
    data: CreateLearnerDto | CreateLearnerRequest
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/v1/learners`,
      data
    );
  }

  updateLearner(
    studentId: string,
    data: UpdateLearnerDto
  ): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${this.baseUrl}/v1/learners/${studentId}`,
      data
    );
  }

  deleteLearner(
    studentId: string
  ): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.baseUrl}/v1/learners/${studentId}`
    );
  }

  // ==================== CLASSES ====================

  getClasses(classId?: string): Observable<ClassListResponseDto> {
    const url = classId
      ? `${this.baseUrl}/v1/classes/${classId}`
      : `${this.baseUrl}/v1/classes`;
    return this.http.get<ClassListResponseDto>(url);
  }

  createClass(
    data: CreateClassDto | CreateClassRequest
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/v1/classes`,
      data
    );
  }

  updateClass(
    classId: string,
    data: UpdateClassDto
  ): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${this.baseUrl}/v1/classes/${classId}`,
      data
    );
  }

  deleteClass(
    classId: string
  ): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.baseUrl}/v1/classes/${classId}`
    );
  }

  // ==================== SUBJECTS ====================

  getSubjects(subjectId?: string): Observable<SubjectListResponseDto> {
    const url = subjectId
      ? `${this.baseUrl}/v1/subjects/${subjectId}`
      : `${this.baseUrl}/v1/subjects`;
    return this.http.get<SubjectListResponseDto>(url);
  }

  createSubject(
    data: CreateSubjectDto
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/v1/subjects`,
      data
    );
  }

  updateSubject(
    subjectId: string,
    data: UpdateSubjectDto
  ): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${this.baseUrl}/v1/subjects/${subjectId}`,
      data
    );
  }

  deleteSubject(
    subjectId: string
  ): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.baseUrl}/v1/subjects/${subjectId}`
    );
  }

  // ==================== TEACHERS ====================

  getTeachers(teacherId?: string): Observable<TeacherListResponseDto> {
    const url = teacherId
      ? `${this.baseUrl}/v1/teachers/${teacherId}`
      : `${this.baseUrl}/v1/teachers`;
    return this.http.get<TeacherListResponseDto>(url);
  }

  createTeacher(
    data: CreateTeacherDto
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/v1/teachers`,
      data
    );
  }

  updateTeacher(
    teacherId: string,
    data: UpdateTeacherDto
  ): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${this.baseUrl}/v1/teachers/${teacherId}`,
      data
    );
  }

  deleteTeacher(
    teacherId: string
  ): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.baseUrl}/v1/teachers/${teacherId}`
    );
  }
}
