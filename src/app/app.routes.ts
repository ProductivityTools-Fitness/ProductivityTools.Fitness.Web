import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./console/hello/hello.component').then((m) => m.HelloComponent),
  },
  {
    path: 'workout',
    loadComponent: () =>
      import('./workout/master/master.component').then((m) => m.MasterComponent),
  },
    {
    path: 'exercise-list',
    loadComponent: () =>
      import('./exercise/list/list.component').then((m) => m.ListComponent),
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

