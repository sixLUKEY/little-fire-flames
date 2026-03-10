import { HttpMethod, RouteHandler } from '../types';
import { authRoutes } from './auth/routes';
import { classRoutes } from './class/routes';
import { learnerRoutes } from './learners/routes';
import { subjectRoutes } from './subjects/routes';
import { teacherRoutes } from './teachers/routes';

export interface RouteDefinition {
  resourcePath: string;
  httpMethod: HttpMethod;
  handler: RouteHandler;
}

export const routes: RouteDefinition[] = [
  ...authRoutes,
  ...classRoutes,
  ...learnerRoutes,
  ...subjectRoutes,
  ...teacherRoutes,
];
