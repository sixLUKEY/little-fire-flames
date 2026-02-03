export interface CreateClassRequest {
  name: string;
  teacherId: string;
}

export interface UpdateClassRequest {
  name?: string;
  teacherId?: string;
  learnerIds?: string[];
}
