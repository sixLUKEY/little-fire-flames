import { RouteDefinition } from "../routes";
import {  handleV1TeacherCreate, handleV1TeacherDelete, handleV1TeacherUpdate, handleV1Teachers } from "./v1Handler";

export const teacherRoutes: RouteDefinition[] = [
  {
    resourcePath: '/v1/teachers/{id}',
    httpMethod: 'GET',
    handler: handleV1Teachers,
  },
  {
    resourcePath: '/v1/teachers',
    httpMethod: 'GET',
    handler: handleV1Teachers,
  },
  {
    resourcePath: '/v1/teachers',
    httpMethod: 'POST',
    handler: handleV1TeacherCreate,
  },
  {
    resourcePath: '/v1/teachers/{id}',
    httpMethod: 'PUT',
    handler: handleV1TeacherUpdate,
  },
  {
    resourcePath: '/v1/teachers/{id}',
    httpMethod: 'DELETE',
    handler: handleV1TeacherDelete,
  },
]
