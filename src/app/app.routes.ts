import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./console/hello/hello.component').then((m) => m.HelloComponent),
  },
  {
    path: 'workout-detail',
    loadComponent: () =>
      import('./workout/workout-detail/workout-detail.component').then(
        (m) => m.WorkoutDetailComponent,
      ),
  },
  {
    path: 'exercise-list',
    loadComponent: () => import('./exercise/list/list.component').then((m) => m.ListComponent),
  },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
