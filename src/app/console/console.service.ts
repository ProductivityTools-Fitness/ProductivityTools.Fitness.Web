import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConsoleService {
  private readonly http = inject(HttpClient);

  getServerName(): Observable<string> {
    return this.http.get('https://fitness-api-cloud.productivitytools.top/api/debug/serverName', {
      responseType: 'text',
    });
  }
}
