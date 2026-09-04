import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { WorkoutService } from '../workout.service';
import { Workout } from '../models/workout';

@Component({
  selector: 'app-workout-detail',
  imports: [RouterLink, DatePipe],
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
}





