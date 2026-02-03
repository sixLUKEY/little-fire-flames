import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home').then(m => m.Home),
  },
  {
    path: 'learner-centre',
    loadComponent: () => import('./learner-centre/learner-centre').then(m => m.LearnerCentre),
    children: [
      {
        path: '',
        redirectTo: 'learners',
        pathMatch: 'full',
      },
      {
        path: 'learners',
        loadComponent: () => import('./learner-centre/learners/learners').then(m => m.Learners),
      },
      {
        path: 'classes',
        loadComponent: () => import('./learner-centre/classes/classes').then(m => m.Classes),
      },
      {
        path: 'subjects',
        loadComponent: () => import('./learner-centre/subjects/subjects').then(m => m.Subjects),
      },
      {
        path: 'teachers',
        loadComponent: () => import('./learner-centre/teachers/teachers').then(m => m.Teachers),
      },
      {
        path: 'results',
        loadComponent: () => import('./learner-centre/results/results').then(m => m.Results),
      },
    ],
  },
  {
    path: 'report-centre',
    loadComponent: () => import('./report-centre/report-centre').then(m => m.ReportCentre),
  },
  {
    path: 'parents-corner',
    loadComponent: () => import('./parents-corner/parents-corner').then(m => m.ParentsCorner)
  }
];
