import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Workout } from './models/workout';

export interface AddSetRequest {
  workoutId: number;
  exerciseId: number;
}

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private readonly http = inject(HttpClient);

  getWorkoutList(): Observable<Workout[]> {
    return this.http.get<Workout[]>(`${environment.apiUrl}/workout/list`);
  }

  getWorkout(workoutId: number): Observable<Workout> {
    return this.http.get<Workout>(`${environment.apiUrl}/workout/${workoutId}`);
  }

  newWorkout(title?: string): Observable<Workout> {
    return this.http.post<Workout>(`${environment.apiUrl}/workout/add`, {
      title: title || undefined,
    });
  }

  updateWorkoutTitle(workoutId: number, title: string): Observable<Workout> {
    return this.http.put<Workout>(`${environment.apiUrl}/workout/${workoutId}/title`, {
      title,
    });
  }

  updateExerciseList(workoutId: number, exerciseIds: number[]): Observable<boolean> {
    console.log('workoutid', workoutId);
    console.log('exercise list', exerciseIds);
    return this.http.post<boolean>(`${environment.apiUrl}/workout/${workoutId}/exercise`, {
      workoutId: workoutId,
      exerciseIds: exerciseIds,
    });
  }

  addSet(workoutId: number, exerciseId: number): Observable<Workout> {
    const request: AddSetRequest = { workoutId, exerciseId };
    return this.http.post<Workout>(`${environment.apiUrl}/workout/addSet`, request);
  }
}

