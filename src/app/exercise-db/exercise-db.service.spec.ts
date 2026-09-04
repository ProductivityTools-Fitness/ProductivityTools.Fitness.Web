import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ExerciseDbService } from './exercise-db.service';

describe('ExerciseDbService', () => {
  let service: ExerciseDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ExerciseDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
