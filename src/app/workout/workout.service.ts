import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private readonly http = inject(HttpClient);

  newWorkout() {
    let workoutId:Observable<number> =this.http.post<number>(`${environment.apiUrl}/workout/newWorkout`,{
      title:"xxx"
    });
    return workoutId;
  }

  updateExerciseList(workoutId: number, exerciseList: number[]): Observable<boolean> {
    console.log('workoutid', workoutId);
    console.log('exercise list', exerciseList);
    return this.http.post<boolean>(`${environment.apiUrl}/workout/exerciseList`, {
      workoutId: workoutId,
      exerciseList: exerciseList,
    });
  }
}
