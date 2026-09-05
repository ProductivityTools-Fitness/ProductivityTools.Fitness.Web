import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { WorkoutService } from './workout.service';
import { environment } from '../../environments/environment';
import { Workout } from './models/workout';

describe('WorkoutService', () => {
  let service: WorkoutService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(WorkoutService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post addSet with workoutId and exerciseId', () => {
    const mockWorkout: Workout = {
      id: 5,
      title: 'Trening #5',
      exercises: [],
    };

    service.addSet(5, 10).subscribe((res) => {
      expect(res).toEqual(mockWorkout);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/workout/addSet`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ workoutId: 5, exerciseId: 10 });
    req.flush(mockWorkout);
  });
});
