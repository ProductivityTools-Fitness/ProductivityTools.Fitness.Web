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
      next: (workout) => {
        console.log('Workout created with ID:', workout.id);
        this.router.navigate(['/workouts/detail'], {
          queryParams: { workoutId: workout.id },
        });
      },
      error: (err) => console.error('Error creating workout:', err),
    });
  }

}

