import { Component, OnInit,signal} from '@angular/core';
import { Router } from '@angular/router';
import { WorkoutService } from '../workout.service';
import { Workout } from '../models/workout';

@Component({
  selector: 'app-workout-list',
  imports: [],
  templateUrl: './workout-list.component.html',
  styleUrl: './workout-list.component.css',
})
export class WorkoutListComponent implements OnInit {

  workoutList=signal<Workout[]>([]);

  constructor(
    private workoutService: WorkoutService,
    private router: Router,
  ) {}


  ngOnInit(): void {
    this.workoutService.workoutList().subscribe((workouts)=>{
      this.workoutList.set(workouts);
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

}

