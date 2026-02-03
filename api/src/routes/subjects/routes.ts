import { RouteDefinition } from "../routes";
import { handleV1SubjectCreate, handleV1SubjectDelete, handleV1SubjectUpdate, handleV1Subjects } from "./v1Handler";

export const subjectRoutes: RouteDefinition[] = [
  {
    resourcePath: '/v1/subjects/{id}',
    httpMethod: 'GET',
    handler: handleV1Subjects,
  },
  {
    resourcePath: '/v1/subjects',
    httpMethod: 'GET',
    handler: handleV1Subjects,
  },
  {
    resourcePath: '/v1/subjects',
    httpMethod: 'POST',
    handler: handleV1SubjectCreate,
  },
  {
    resourcePath: '/v1/subjects/{id}',
    httpMethod: 'PUT',
    handler: handleV1SubjectUpdate,
  },
  {
    resourcePath: '/v1/subjects/{id}',
    httpMethod: 'DELETE',
    handler: handleV1SubjectDelete,
  },
]
