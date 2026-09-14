import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { WorkoutService } from '../workout.service';
import { Workout } from '../models/workout';

@Component({
  selector: 'app-workout-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './workout-list.component.html',
  styleUrl: './workout-list.component.css',
})
export class WorkoutListComponent implements OnInit {
  workoutList = signal<Workout[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  constructor(
    private workoutService: WorkoutService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadWorkouts();
  }

  loadWorkouts(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.workoutService.getWorkoutList().subscribe({
      next: (workouts) => {
        this.workoutList.set(workouts);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching workout list:', err);
        this.errorMessage.set('Failed to load workouts. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  newWorkout() {
    this.workoutService.newWorkout().subscribe({
      next: (workout) => {
        console.log('Workout created with ID:', workout.id);
        this.router.navigate(['/workouts/detail'], {
          queryParams: { workoutId: workout.id },
        });
      },
      error: (err) => console.error('Error creating workout:', err),
    });
  }

  openWorkout(workoutId?: number): void {
    if (!workoutId) return;
    this.router.navigate(['/workouts/detail'], {
      queryParams: { workoutId },
    });
  }

  getWorkoutTitle(workout: Workout): string {
    if (
      workout.title &&
      workout.title.trim() !== '' &&
      !['Log Workout', 'New workout'].includes(workout.title)
    ) {
      return workout.title;
    }
    return `Trening #${workout.workoutNumber ?? workout.id}`;
  }
}




