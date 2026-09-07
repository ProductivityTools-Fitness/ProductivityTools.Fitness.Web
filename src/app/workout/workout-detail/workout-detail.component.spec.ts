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

  it('should start and stop editing cell', () => {
    const set = { id: 101, setNumber: 1, weightKg: 50, reps: 8, isCompleted: false };
    expect(component.isEditing(101, 'weight')).toBe(false);

    component.startEdit(set, 'weight');
    expect(component.isEditing(101, 'weight')).toBe(true);
    expect(component.isEditing(101, 'reps')).toBe(false);

    component.stopEdit();
    expect(component.isEditing(101, 'weight')).toBe(false);
  });

  it('should save weight and call workoutService.saveSet when weight changes', () => {
    const workoutService = TestBed.inject(WorkoutService);
    const set = { id: 101, setNumber: 1, weightKg: 50, reps: 8, isCompleted: false };
    const initialWorkout: Workout = {
      id: 1,
      title: 'Trening #1',
      exercises: [
        {
          orderIndex: 1,
          exercise: { id: 42, name: 'Squat', isSystem: true },
          sets: [{ ...set }],
        },
      ],
    };
    component.workout.set(initialWorkout);

    const updatedSet = { ...set, weightKg: 65 };
    const saveSetSpy = vi.spyOn(workoutService, 'saveSet').mockReturnValue(of(updatedSet));

    component.startEdit(set, 'weight');
    component.saveWeight(set, '65');

    expect(saveSetSpy).toHaveBeenCalledWith({
      id: 101,
      kg: 65,
      reps: 8,
      status: false,
    });
    expect(component.isEditing(101, 'weight')).toBe(false);
    expect(component.workout()?.exercises?.[0].sets?.[0].weightKg).toBe(65);
  });

  it('should not call saveSet if weight did not change', () => {
    const workoutService = TestBed.inject(WorkoutService);
    const set = { id: 101, setNumber: 1, weightKg: 50, reps: 8, isCompleted: false };
    const saveSetSpy = vi.spyOn(workoutService, 'saveSet');

    component.startEdit(set, 'weight');
    component.saveWeight(set, '50');

    expect(saveSetSpy).not.toHaveBeenCalled();
    expect(component.isEditing(101, 'weight')).toBe(false);
  });

  it('should save reps and call workoutService.saveSet when reps change', () => {
    const workoutService = TestBed.inject(WorkoutService);
    const set = { id: 101, setNumber: 1, weightKg: 50, reps: 8, isCompleted: false };
    const initialWorkout: Workout = {
      id: 1,
      title: 'Trening #1',
      exercises: [
        {
          orderIndex: 1,
          exercise: { id: 42, name: 'Squat', isSystem: true },
          sets: [{ ...set }],
        },
      ],
    };
    component.workout.set(initialWorkout);

    const updatedSet = { ...set, reps: 12 };
    const saveSetSpy = vi.spyOn(workoutService, 'saveSet').mockReturnValue(of(updatedSet));

    component.startEdit(set, 'reps');
    component.saveReps(set, '12');

    expect(saveSetSpy).toHaveBeenCalledWith({
      id: 101,
      kg: 50,
      reps: 12,
      status: false,
    });
    expect(component.isEditing(101, 'reps')).toBe(false);
    expect(component.workout()?.exercises?.[0].sets?.[0].reps).toBe(12);
  });

  it('should complete set by setting status to true and calling saveSet', () => {
    const workoutService = TestBed.inject(WorkoutService);
    const set = { id: 101, setNumber: 1, weightKg: 80, reps: 10, isCompleted: false };
    const initialWorkout: Workout = {
      id: 1,
      title: 'Trening #1',
      exercises: [
        {
          orderIndex: 1,
          exercise: { id: 42, name: 'Squat', isSystem: true },
          sets: [{ ...set }],
        },
      ],
    };
    component.workout.set(initialWorkout);

    const updatedSet = { ...set, isCompleted: true };
    const saveSetSpy = vi.spyOn(workoutService, 'saveSet').mockReturnValue(of(updatedSet));

    component.completeSet(set);

    expect(saveSetSpy).toHaveBeenCalledWith({
      id: 101,
      kg: 80,
      reps: 10,
      status: true,
    });
    expect(component.workout()?.exercises?.[0].sets?.[0].isCompleted).toBe(true);
  });

  it('should reset completed set by setting status to false and calling saveSet', () => {
    const workoutService = TestBed.inject(WorkoutService);
    const set = { id: 101, setNumber: 1, weightKg: 80, reps: 10, isCompleted: true };
    const initialWorkout: Workout = {
      id: 1,
      title: 'Trening #1',
      exercises: [
        {
          orderIndex: 1,
          exercise: { id: 42, name: 'Squat', isSystem: true },
          sets: [{ ...set }],
        },
      ],
    };
    component.workout.set(initialWorkout);

    const updatedSet = { ...set, isCompleted: false };
    const saveSetSpy = vi.spyOn(workoutService, 'saveSet').mockReturnValue(of(updatedSet));

    component.completeSet(set);

    expect(saveSetSpy).toHaveBeenCalledWith({
      id: 101,
      kg: 80,
      reps: 10,
      status: false,
    });
    expect(component.workout()?.exercises?.[0].sets?.[0].isCompleted).toBe(false);
  });

  it('should delete a set and renumber remaining sets', () => {
    const workoutService = TestBed.inject(WorkoutService);
    const set1 = { id: 101, setNumber: 1, weightKg: 80, reps: 10, isCompleted: true };
    const set2 = { id: 102, setNumber: 2, weightKg: 85, reps: 8, isCompleted: false };
    const set3 = { id: 103, setNumber: 3, weightKg: 90, reps: 6, isCompleted: false };
    const initialWorkout: Workout = {
      id: 1,
      title: 'Trening #1',
      exercises: [
        {
          orderIndex: 1,
          exercise: { id: 42, name: 'Squat', isSystem: true },
          sets: [{ ...set1 }, { ...set2 }, { ...set3 }],
        },
      ],
    };
    component.workout.set(initialWorkout);

    const deleteSetSpy = vi.spyOn(workoutService, 'deleteSet').mockReturnValue(of(true));

    component.deleteSet(set2);

    expect(deleteSetSpy).toHaveBeenCalledWith(102);
    const remainingSets = component.workout()?.exercises?.[0].sets;
    expect(remainingSets?.length).toBe(2);
    expect(remainingSets?.[0].id).toBe(101);
    expect(remainingSets?.[0].setNumber).toBe(1);
    expect(remainingSets?.[1].id).toBe(103);
    expect(remainingSets?.[1].setNumber).toBe(2);
    expect(component.isDeletingSet()).toBeNull();
  });

  it('should render Previous column with format xkg x reps', () => {
    const set1 = {
      id: 101,
      setNumber: 1,
      weightKg: 80,
      reps: 10,
      prevWeightKg: 50,
      prevReps: 10,
      isCompleted: false,
    };
    const set2 = {
      id: 102,
      setNumber: 2,
      weightKg: 80,
      reps: 10,
      prevWeightKg: null,
      prevReps: null,
      isCompleted: false,
    };
    const initialWorkout: Workout = {
      id: 1,
      title: 'Trening #1',
      exercises: [
        {
          orderIndex: 1,
          exercise: { id: 42, name: 'Squat', isSystem: true },
          sets: [set1, set2],
        },
      ],
    };
    component.workout.set(initialWorkout);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const prevElements = compiled.querySelectorAll<HTMLElement>('.prev-val');
    expect(prevElements.length).toBe(2);
    expect(prevElements[0].textContent?.trim()).toBe('50kg x 10');
    expect(prevElements[1].textContent?.trim()).toBe('—');
  });

  it('should correctly format previous set in formatPrevious', () => {
    expect(
      component.formatPrevious({
        setNumber: 1,
        weightKg: 0,
        reps: 0,
        isCompleted: false,
        prevWeightKg: 50,
        prevReps: 10,
      })
    ).toBe('50kg x 10');
    expect(
      component.formatPrevious({
        setNumber: 1,
        weightKg: 0,
        reps: 0,
        isCompleted: false,
        prevWeightKg: 72.5,
        prevReps: 8,
      })
    ).toBe('72.5kg x 8');
    expect(
      component.formatPrevious({
        setNumber: 1,
        weightKg: 0,
        reps: 0,
        isCompleted: false,
        prevWeightKg: null,
        prevReps: null,
      })
    ).toBe('—');
    expect(
      component.formatPrevious({
        setNumber: 1,
        weightKg: 0,
        reps: 0,
        isCompleted: false,
      })
    ).toBe('—');
  });
});


