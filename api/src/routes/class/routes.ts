import { RouteDefinition } from "../routes";
import { handleV1ClassCreate, handleV1ClassDelete, handleV1ClassUpdate, handleV1Classes } from "./v1Handler";

export const classRoutes: RouteDefinition[] = [
  {
    resourcePath: '/v1/classes/{id}',
    httpMethod: 'GET',
    handler: handleV1Classes,
  },
  {
    resourcePath: '/v1/classes',
    httpMethod: 'GET',
    handler: handleV1Classes,
  },
  {
    resourcePath: '/v1/classes',
    httpMethod: 'POST',
    handler: handleV1ClassCreate,
  },
  {
    resourcePath: '/v1/classes/{id}',
    httpMethod: 'PUT',
    handler: handleV1ClassUpdate,
  },
  {
    resourcePath: '/v1/classes/{id}',
    httpMethod: 'DELETE',
    handler: handleV1ClassDelete,
  },
]
