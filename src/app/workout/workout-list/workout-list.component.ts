import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WorkoutService } from '../workout.service';

@Component({
  selector: 'app-workout-list',
  imports: [],
  templateUrl: './workout-list.component.html',
  styleUrl: './workout-list.component.css',
})
export class WorkoutListComponent {
  constructor(
    private workoutService: WorkoutService,
    private router: Router,
  ) {}

  newWorkout() {
    this.workoutService.newWorkout().subscribe({
      next: (workoutId) => {
        console.log('Workout created with ID:', workoutId);
        this.router.navigate(['/workouts/detail'], {
          queryParams: { workoutId },
        });
      },
      error: (err) => console.error('Error creating workout:', err),
    });
  }
}

