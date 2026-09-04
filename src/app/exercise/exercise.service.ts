import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exercise } from './models/exercise';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private readonly http = inject(HttpClient);

  getExerciseList(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${environment.apiUrl}/exercise/list`);
  }

  getExerciseById(id: number): Observable<Exercise> {
    return this.http.get<Exercise>(`${environment.apiUrl}/exercise/${id}`);
  }
}


