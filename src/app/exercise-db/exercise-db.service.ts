import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ExternalSearchResult } from './models/external-search-result';
import { Exercise } from '../exercise/models/exercise';

@Injectable({
  providedIn: 'root',
})
export class ExerciseDbService {
  private readonly http = inject(HttpClient);

  searchExercises(
    name?: string,
    bodyCategory?: string,
    equipmentCategory?: string,
    limit: number = 20,
  ): Observable<ExternalSearchResult[]> {
    let params = new HttpParams().set('limit', limit);
    if (name && name.trim()) {
      params = params.set('name', name.trim());
    }
    if (bodyCategory && bodyCategory.trim()) {
      params = params.set('bodyCategory', bodyCategory.trim());
    }
    if (equipmentCategory && equipmentCategory.trim()) {
      params = params.set('equipmentCategory', equipmentCategory.trim());
    }

    return this.http.get<ExternalSearchResult[]>(
      `${environment.apiUrl}/exercisedb/search`,
      { params },
    );
  }

  importExercise(externalExerciseId: string): Observable<Exercise> {
    return this.http.post<Exercise>(
      `${environment.apiUrl}/exercisedb/import/${externalExerciseId}`,
      {},
    );
  }
}
