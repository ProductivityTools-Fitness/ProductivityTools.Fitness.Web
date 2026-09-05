import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkoutService } from '../workout.service';
import { Workout } from '../models/workout';

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
}






