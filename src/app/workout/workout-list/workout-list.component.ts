import { Component ,} from '@angular/core';
import { RouterLink } from '@angular/router';
import { WorkoutService } from '../workout.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-workout-list',
  imports: [RouterLink],
  templateUrl: './workout-list.component.html',
  styleUrl: './workout-list.component.css',
})
export class WorkoutListComponent {
  constructor(
    private workoutService: WorkoutService) {}

  newWorkout() {
    this.workoutService.newWorkout().subscribe({
      next: (entity) => {
        
        let workoutId=entity;
        console.log('zapisano',workoutId)
      },
      error: (err) => console.log('blad', err),
    });
  }
}
