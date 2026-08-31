import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./console/hello/hello').then((m) => m.Hello),
  },
  {
    path: 'workout',
    loadComponent: () => import('./workout/master/master').then((m) => m.Master),
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
