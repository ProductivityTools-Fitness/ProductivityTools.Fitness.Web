import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ExerciseListComponent } from './exercise-list.component';

describe('ExerciseListComponent', () => {
  let component: ExerciseListComponent;
  let fixture: ComponentFixture<ExerciseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();


    fixture = TestBed.createComponent(ExerciseListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


