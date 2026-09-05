import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { WorkoutDetailComponent } from './workout-detail.component';
import { WorkoutService } from '../workout.service';
import { Workout } from '../models/workout';

describe('WorkoutDetailComponent', () => {
  let component: WorkoutDetailComponent;
  let fixture: ComponentFixture<WorkoutDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutDetailComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();


    fixture = TestBed.createComponent(WorkoutDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call workoutService.addSet and update workout with returned value', () => {
    const workoutService = TestBed.inject(WorkoutService);
    const initialWorkout: Workout = {
      id: 10,
      title: 'Trening #10',
      exercises: [
        {
          orderIndex: 1,
          exercise: { id: 42, name: 'Squat', isSystem: true },
          sets: [{ setNumber: 1, weightKg: 80, reps: 10, isCompleted: false }],
        },
      ],
    };

    const updatedWorkout: Workout = {
      id: 10,
      title: 'Trening #10',
      exercises: [
        {
          orderIndex: 1,
          exercise: { id: 42, name: 'Squat', isSystem: true },
          sets: [
            { setNumber: 1, weightKg: 80, reps: 10, isCompleted: false },
            { setNumber: 2, weightKg: 80, reps: 10, isCompleted: false },
          ],
        },
      ],
    };

    component.workout.set(initialWorkout);
    const addSetSpy = vi.spyOn(workoutService, 'addSet').mockReturnValue(of(updatedWorkout));

    component.addSet(42);

    expect(addSetSpy).toHaveBeenCalledWith(10, 42);
    expect(component.workout()).toEqual(updatedWorkout);
    expect(component.workout()?.exercises?.[0].sets?.length).toBe(2);
    expect(component.isAddingSet()).toBeNull();
  });
});


