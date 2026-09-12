import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HevyImportRequest, HevyImportResponse } from './models/hevy-import';

@Injectable({
  providedIn: 'root',
})
export class HevyImportService {
  private readonly http = inject(HttpClient);

  importFromHevy(request?: HevyImportRequest): Observable<HevyImportResponse> {
    return this.http.post<HevyImportResponse>(
      `${environment.apiUrl}/workout/import/hevy`,
      request ?? {}
    );
  }
}
