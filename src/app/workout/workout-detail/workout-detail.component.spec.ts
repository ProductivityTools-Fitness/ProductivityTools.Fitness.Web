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

  it('should format seconds into readable duration', () => {
    expect(component.formatSeconds(0)).toBe('0s');
    expect(component.formatSeconds(45)).toBe('45s');
    expect(component.formatSeconds(60)).toBe('1m');
    expect(component.formatSeconds(75)).toBe('1m 15s');
    expect(component.formatSeconds(3600)).toBe('1h');
    expect(component.formatSeconds(3660)).toBe('1h 1m');
    expect(component.formatSeconds(3665)).toBe('1h 1m 5s');
  });

  it('should render duration and status in workout-meta', () => {
    const workoutWithDuration: Workout = {
      id: 20,
      title: 'Trening #20',
      status: 'IN_PROGRESS',
      durationSeconds: 4500,
      exercises: [],
    };
    component.workout.set(workoutWithDuration);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.stat-badge.duration')).toBeNull();

    const metaText = compiled.querySelector<HTMLElement>('.workout-meta');
    expect(metaText?.textContent).toContain('Duration: 1h 15m');
    expect(metaText?.textContent).toContain('Status: IN_PROGRESS');
  });

  it('should calculate live duration from startTime for in-progress workout and advance on tick', () => {
    const baseTime = new Date('2026-09-07T12:00:00Z');
    const startTime = new Date('2026-09-07T11:58:30Z'); // 90 seconds ago

    component.currentTime.set(baseTime);
    const activeWorkout: Workout = {
      id: 25,
      title: 'Trening #25',
      status: 'IN_PROGRESS',
      startTime: startTime.toISOString(),
      durationSeconds: 0,
      exercises: [],
    };
    component.workout.set(activeWorkout);
    fixture.detectChanges();

    expect(component.getFormattedDuration()).toBe('1m 30s');

    // Advance current time by 15 seconds
    const advancedTime = new Date('2026-09-07T12:00:15Z');
    component.currentTime.set(advancedTime);
    fixture.detectChanges();

    expect(component.getFormattedDuration()).toBe('1m 45s');

    const compiled = fixture.nativeElement as HTMLElement;
    const metaText = compiled.querySelector<HTMLElement>('.workout-meta');
    expect(metaText?.textContent).toContain('Duration: 1m 45s');
  });

  it('should clean up duration timer on destroy', () => {
    const stopTimerSpy = vi.spyOn(component, 'stopDurationTimer');
    component.ngOnDestroy();
    expect(stopTimerSpy).toHaveBeenCalled();
  });

  it('should calculate Volume and Sets for completed sets and render in workout-meta', () => {
    const workout: Workout = {
      id: 21,
      title: 'Trening #21',
      exercises: [
        {
          orderIndex: 1,
          exercise: { id: 1, name: 'Squat', isSystem: true },
          sets: [
            { id: 1, setNumber: 1, weightKg: 100, reps: 10, isCompleted: true }, // 1000kg
            { id: 2, setNumber: 2, weightKg: 100, reps: 8, isCompleted: true },  // 800kg
            { id: 3, setNumber: 3, weightKg: 100, reps: 6, isCompleted: false }, // not completed
          ],
        },
        {
          orderIndex: 2,
          exercise: { id: 2, name: 'Bench Press', isSystem: true },
          sets: [
            { id: 4, setNumber: 1, weightKg: 60, reps: 10, isCompleted: true },  // 600kg
            { id: 5, setNumber: 2, weightKg: 60, reps: 10, isCompleted: false }, // not completed
          ],
        },
      ],
    };
    component.workout.set(workout);
    fixture.detectChanges();

    // Volume: 1000 + 800 + 600 = 2400 kg
    expect(component.getTotalVolume()).toBe(2400);
    // Completed sets: 3
    expect(component.getCompletedSetsCount()).toBe(3);
    // Total sets: 5
    expect(component.getTotalSetsCount()).toBe(5);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.stat-badge.volume')).toBeNull();
    expect(compiled.querySelector('.stat-badge.sets')).toBeNull();

    const metaText = compiled.querySelector<HTMLElement>('.workout-meta');
    expect(metaText?.textContent).toContain('Volume: 2400 kg');
    expect(metaText?.textContent).toContain('Sets: 3 / 5');
  });

  it('should display exercise notes or placeholder and allow editing on click', () => {
    const workout: Workout = {
      id: 30,
      title: 'Trening #30',
      exercises: [
        {
          id: 101,
          orderIndex: 1,
          exercise: { id: 1, name: 'Squat', isSystem: true },
          notes: 'Focus on depth',
        },
        {
          id: 102,
          orderIndex: 2,
          exercise: { id: 2, name: 'Bench Press', isSystem: true },
          notes: null,
        },
      ],
    };
    component.workout.set(workout);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const notesDisplays = compiled.querySelectorAll<HTMLElement>('.exercise-notes-display');
    expect(notesDisplays.length).toBe(2);

    expect(notesDisplays[0].textContent).toContain('Focus on depth');
    expect(notesDisplays[1].textContent).toContain('Add notes...');

    // Click on notes to start edit
    notesDisplays[0].click();
    fixture.detectChanges();

    expect(component.isEditingNotes(workout.exercises![0])).toBe(true);
    expect(component.exerciseNotesInput).toBe('Focus on depth');

    const editInput = compiled.querySelector<HTMLInputElement>('.exercise-notes-input');
    expect(editInput).toBeTruthy();

    // Cancel edit
    component.cancelEditNotes();
    fixture.detectChanges();

    expect(component.isEditingNotes(workout.exercises![0])).toBe(false);
  });

  it('should call workoutService.saveExerciseNotes and update local workout on save', () => {
    const workoutService = TestBed.inject(WorkoutService);
    const workoutExercise = {
      id: 101,
      orderIndex: 1,
      exercise: { id: 1, name: 'Squat', isSystem: true },
      notes: 'Initial note',
    };
    const workout: Workout = {
      id: 31,
      title: 'Trening #31',
      exercises: [workoutExercise],
    };
    component.workout.set(workout);
    fixture.detectChanges();

    const updatedWorkoutExercise = {
      ...workoutExercise,
      notes: 'Updated note from server',
    };
    const saveNotesSpy = vi
      .spyOn(workoutService, 'saveExerciseNotes')
      .mockReturnValue(of(updatedWorkoutExercise as any));

    component.startEditNotes(workoutExercise);
    component.exerciseNotesInput = 'Updated note from server';
    component.saveExerciseNotes(workoutExercise);

    expect(saveNotesSpy).toHaveBeenCalledWith(101, 'Updated note from server');
    expect(component.workout()?.exercises?.[0].notes).toBe('Updated note from server');
    expect(component.isEditingNotes(workoutExercise)).toBe(false);
  });

  it('should start editing workout title when clicking on the title text', () => {
    const workout: Workout = {
      id: 32,
      title: 'Leg Day',
      exercises: [],
    };
    component.workout.set(workout);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const titleHeader = compiled.querySelector<HTMLElement>('.clickable-title');
    expect(titleHeader).toBeTruthy();

    titleHeader?.click();
    fixture.detectChanges();

    expect(component.isEditingTitle()).toBe(true);
    expect(component.titleInput).toBe('Leg Day');
  });

  it('should render Complete Training button for in-progress workout and call completeWorkout on click', () => {
    const workoutService = TestBed.inject(WorkoutService);
    const workout: Workout = {
      id: 40,
      title: 'Trening #40',
      status: 'IN_PROGRESS',
      exercises: [],
    };
    component.workout.set(workout);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const completeBtns = compiled.querySelectorAll<HTMLButtonElement>('.btn-complete-training');
    expect(completeBtns.length).toBeGreaterThan(0);
    expect(completeBtns[0].textContent).toContain('Complete Training');

    const completedWorkout: Workout = {
      ...workout,
      status: 'COMPLETED',
      durationSeconds: 1800,
    };
    const completeSpy = vi
      .spyOn(workoutService, 'completeWorkout')
      .mockReturnValue(of(completedWorkout));

    completeBtns[0].click();
    fixture.detectChanges();

    expect(completeSpy).toHaveBeenCalledWith(40);
    expect(component.workout()?.status).toBe('COMPLETED');

    const remainingBtns = compiled.querySelectorAll<HTMLButtonElement>('.btn-complete-training');
    expect(remainingBtns.length).toBe(0);
  });

  it('should not render Complete Training button when workout is already COMPLETED', () => {
    const completedWorkout: Workout = {
      id: 41,
      title: 'Trening #41',
      status: 'COMPLETED',
      durationSeconds: 2400,
      exercises: [],
    };
    component.workout.set(completedWorkout);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const completeBtns = compiled.querySelectorAll<HTMLButtonElement>('.btn-complete-training');
    expect(completeBtns.length).toBe(0);
  });
});



