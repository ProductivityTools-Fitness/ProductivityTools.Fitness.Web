import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkoutService, SaveSetRequest } from '../workout.service';
import { Workout, WorkoutSet } from '../models/workout';

@Component({
  selector: 'app-workout-detail',
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: './workout-detail.component.html',
  styleUrl: './workout-detail.component.css',
})
export class WorkoutDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly workoutService = inject(WorkoutService);

  workoutId = signal<number | null>(null);
  workout = signal<Workout | null>(null);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  isEditingTitle = signal<boolean>(false);
  titleInput = '';
  isSavingTitle = signal<boolean>(false);
  isAddingSet = signal<number | null>(null);
  editingCell = signal<{ setId: number; field: 'weight' | 'reps' } | null>(null);
  savingSetId = signal<number | null>(null);

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const idParam = params.get('workoutId');
      if (idParam) {
        const id = Number(idParam);
        this.workoutId.set(id);
        this.loadWorkout(id);
      } else {
        this.workoutId.set(null);
        this.workout.set(null);
      }
    });
  }

  getWorkoutTitle(workout: Workout | null): string {
    if (!workout) return '';
    if (
      workout.title &&
      workout.title.trim() !== '' &&
      !['Log Workout', 'New workout'].includes(workout.title)
    ) {
      return workout.title;
    }
    return `Trening #${workout.id}`;
  }

  startEditTitle(): void {
    this.titleInput = this.getWorkoutTitle(this.workout());
    this.isEditingTitle.set(true);
  }

  cancelEditTitle(): void {
    this.isEditingTitle.set(false);
  }

  saveTitle(): void {
    const newTitle = this.titleInput.trim();
    const currentWorkout = this.workout();
    if (!currentWorkout || !currentWorkout.id || !newTitle) {
      return;
    }

    this.isSavingTitle.set(true);
    this.workoutService.updateWorkoutTitle(currentWorkout.id, newTitle).subscribe({
      next: (updated) => {
        this.workout.update((w) => (w ? { ...w, title: updated.title || newTitle } : null));
        this.isSavingTitle.set(false);
        this.isEditingTitle.set(false);
      },
      error: (err) => {
        console.error('Error updating title:', err);
        this.workout.update((w) => (w ? { ...w, title: newTitle } : null));
        this.isSavingTitle.set(false);
        this.isEditingTitle.set(false);
      },
    });
  }

  loadWorkout(id: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.workoutService.getWorkout(id).subscribe({
      next: (workout) => {
        this.workout.set(workout);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading workout details:', err);
        this.errorMessage.set('Failed to load workout details. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  addSet(exerciseId: number): void {
    const currentWorkout = this.workout();
    if (!currentWorkout || !currentWorkout.id || !exerciseId) {
      return;
    }

    this.isAddingSet.set(exerciseId);
    this.workoutService.addSet(currentWorkout.id, exerciseId).subscribe({
      next: (updatedWorkout) => {
        this.workout.set(updatedWorkout);
        this.isAddingSet.set(null);
      },
      error: (err) => {
        console.error('Error adding set:', err);
        this.isAddingSet.set(null);
      },
    });
  }

  isEditing(setId: number | undefined, field: 'weight' | 'reps'): boolean {
    if (!setId) return false;
    const current = this.editingCell();
    return current !== null && current.setId === setId && current.field === field;
  }

  startEdit(set: WorkoutSet, field: 'weight' | 'reps'): void {
    if (!set.id) return;
    this.editingCell.set({ setId: set.id, field });
    setTimeout(() => {
      const inputEl = document.getElementById(`input-${field}-${set.id}`) as HTMLInputElement;
      if (inputEl) {
        inputEl.focus();
        inputEl.select();
      }
    });
  }

  stopEdit(): void {
    this.editingCell.set(null);
  }

  saveWeight(set: WorkoutSet, rawValue: string | number): void {
    if (!this.isEditing(set.id, 'weight')) {
      return;
    }
    this.stopEdit();

    const num = Number(rawValue);
    if (isNaN(num) || num < 0) {
      return;
    }

    if (num === set.weightKg) {
      return;
    }

    const previousWeight = set.weightKg;
    set.weightKg = num;

    this.sendSaveSet(
      {
        id: set.id!,
        kg: num,
        reps: set.reps,
        status: set.isCompleted,
      },
      () => {
        set.weightKg = previousWeight;
      }
    );
  }

  saveReps(set: WorkoutSet, rawValue: string | number): void {
    if (!this.isEditing(set.id, 'reps')) {
      return;
    }
    this.stopEdit();

    const num = Math.round(Number(rawValue));
    if (isNaN(num) || num < 0) {
      return;
    }

    if (num === set.reps) {
      return;
    }

    const previousReps = set.reps;
    set.reps = num;

    this.sendSaveSet(
      {
        id: set.id!,
        kg: set.weightKg,
        reps: num,
        status: set.isCompleted,
      },
      () => {
        set.reps = previousReps;
      }
    );
  }

  sendSaveSet(request: SaveSetRequest, onRollback?: () => void): void {
    this.savingSetId.set(request.id);
    this.workoutService.saveSet(request).subscribe({
      next: (updatedSet) => {
        this.updateLocalSet(updatedSet);
        this.savingSetId.set(null);
      },
      error: (err) => {
        console.error('Error saving set:', err);
        if (onRollback) {
          onRollback();
        }
        this.savingSetId.set(null);
      },
    });
  }

  updateLocalSet(updatedSet: WorkoutSet): void {
    this.workout.update((currentWorkout) => {
      if (!currentWorkout || !currentWorkout.exercises) return currentWorkout;
      return {
        ...currentWorkout,
        exercises: currentWorkout.exercises.map((ex) => ({
          ...ex,
          sets: ex.sets?.map((s) => (s.id === updatedSet.id ? { ...s, ...updatedSet } : s)),
        })),
      };
    });
  }

  completeSet(set: WorkoutSet): void {
    if (!set.id) return;
    if (this.savingSetId() === set.id) return;

    const previousStatus = set.isCompleted;
    const newStatus = !previousStatus;
    set.isCompleted = newStatus;

    this.sendSaveSet(
      {
        id: set.id,
        kg: set.weightKg,
        reps: set.reps,
        status: newStatus,
      },
      () => {
        set.isCompleted = previousStatus;
      }
    );
  }
}






