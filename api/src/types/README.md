# Shared Types

This directory contains TypeScript types that are shared between the API and frontend.

## Usage in Frontend

Import types from the API using the path alias:

```typescript
import type {
  LearnerModel,
  CreateLearnerRequest,
  ApiResponse,
  LearnersResponse,
} from '@api/types';
```

## Available Types

### Request DTOs
- `CreateLearnerRequest` - Create a new learner
- `UpdateLearnerRequest` - Update an existing learner
- `CreateClassRequest` - Create a new class
- `UpdateClassRequest` - Update an existing class

### Model Types
- `LearnerModel` - Learner data model
- `ClassModel` - Class data model
- `SubjectModel` - Subject data model
- `TeacherModel` - Teacher data model
- `SubjectResults` - Subject results for learners

### Response Types
- `ApiResponse<T>` - Generic API response wrapper
- `LearnersResponse` - Response containing learners array
- `LearnerResponse` - Response containing single learner
- `ClassesResponse` - Response containing classes array
- `ClassResponse` - Response containing single class
- `SubjectsResponse` - Response containing subjects array
- `SubjectResponse` - Response containing single subject
- `TeachersResponse` - Response containing teachers array
- `TeacherResponse` - Response containing single teacher

## Building

Make sure to build the API before using types in the frontend:

```bash
cd api && npm run build
```

The TypeScript compiler will generate declaration files (`.d.ts`) in the `dist` directory that the frontend can reference.
