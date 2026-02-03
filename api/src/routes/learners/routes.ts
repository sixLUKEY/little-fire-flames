import { RouteDefinition } from "../routes";
import { handleV1LearnerCreate, handleV1LearnerDelete, handleV1LearnerUpdate, handleV1Learners } from "./v1Handler";

export const learnerRoutes: RouteDefinition[] = [
  {
    resourcePath: '/v1/learners/{id}',
    httpMethod: 'GET',
    handler: handleV1Learners,
  },
  {
    resourcePath: '/v1/learners',
    httpMethod: 'GET',
    handler: handleV1Learners,
  },
  {
    resourcePath: '/v1/learners',
    httpMethod: 'POST',
    handler: handleV1LearnerCreate,
  },
  {
    resourcePath: '/v1/learners/{id}',
    httpMethod: 'PUT',
    handler: handleV1LearnerUpdate,
  },
  {
    resourcePath: '/v1/learners/{id}',
    httpMethod: 'DELETE',
    handler: handleV1LearnerDelete,
  },
]
