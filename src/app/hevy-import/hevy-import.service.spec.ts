import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { HevyImportService } from './hevy-import.service';
import { environment } from '../../environments/environment';
import { HevyImportResponse } from './models/hevy-import';

describe('HevyImportService', () => {
  let service: HevyImportService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(HevyImportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post importFromHevy with access-token in body', () => {
    const mockResponse: HevyImportResponse = {
      totalFetched: 10,
      workoutsImported: 8,
      workoutsSkipped: 2,
      exercisesCreated: 4,
      message: 'Successfully imported 8 workouts.',
      importedTitles: ['Workout 1', 'Workout 2'],
    };

    service.importFromHevy({ 'access-token': 'test-hevy-token' }).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/workout/import/hevy`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ 'access-token': 'test-hevy-token' });
    req.flush(mockResponse);
  });

  it('should post importFromHevy with empty body when request is undefined', () => {
    const mockResponse: HevyImportResponse = {
      totalFetched: 0,
      workoutsImported: 0,
      workoutsSkipped: 0,
      exercisesCreated: 0,
      message: 'No workouts found to import.',
      importedTitles: [],
    };

    service.importFromHevy().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/workout/import/hevy`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush(mockResponse);
  });
});
