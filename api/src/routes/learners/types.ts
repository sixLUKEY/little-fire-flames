export interface SubjectResults {
  name: string;
  result: number;
  feedback: string;
}

export interface Learner {
  name: string;
  studentId: string;
  classId: string;
  reults: SubjectResults[];
}

export interface CreateLearnerRequest {
  name: string;
  classId: string;
  studentId: string;
}

export interface UpdateLearnerRequest {
  name?: string;
  classId?: string;
  reults?: SubjectResults[];
}

export interface DeleteLearner {
  studentId: string
}
