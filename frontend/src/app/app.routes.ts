import { Routes } from '@angular/router';
import { loginPageGuard } from './auth/auth.guard';
import { roleGuard } from './auth/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home').then(m => m.Home),
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then(m => m.Login),
    canActivate: [loginPageGuard],
  },
  {
    path: 'learner-centre',
    loadComponent: () => import('./learner-centre/learner-centre').then(m => m.LearnerCentre),
    canActivate: [roleGuard({ allowedRoles: ['principal', 'teacher'], loginRedirect: '/login' })],
    children: [
      {
        path: '',
        redirectTo: 'learners',
        pathMatch: 'full',
      },
      {
        path: 'learners',
        loadComponent: () => import('./learner-centre/learners/learners').then(m => m.Learners),
        canActivate: [roleGuard({ allowedRoles: ['principal'], wrongRoleRedirect: '/learner-centre/results' })],
      },
      {
        path: 'classes',
        loadComponent: () => import('./learner-centre/classes/classes').then(m => m.Classes),
        canActivate: [roleGuard({ allowedRoles: ['principal'], wrongRoleRedirect: '/learner-centre/results' })],
      },
      {
        path: 'subjects',
        loadComponent: () => import('./learner-centre/subjects/subjects').then(m => m.Subjects),
        canActivate: [roleGuard({ allowedRoles: ['principal'], wrongRoleRedirect: '/learner-centre/results' })],
      },
      {
        path: 'teachers',
        loadComponent: () => import('./learner-centre/teachers/teachers').then(m => m.Teachers),
        canActivate: [roleGuard({ allowedRoles: ['principal'], wrongRoleRedirect: '/learner-centre/results' })],
      },
      {
        path: 'results',
        loadComponent: () => import('./learner-centre/results/results').then(m => m.Results),
        canActivate: [roleGuard({ allowedRoles: ['principal', 'teacher'] })],
      },
    ],
  },
  {
    path: 'parents-corner',
    loadComponent: () => import('./parents-corner/parents-corner').then(m => m.ParentsCorner),
  },
];
