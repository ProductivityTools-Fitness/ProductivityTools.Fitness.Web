import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-workout-detail',
  imports: [RouterLink],
  templateUrl: './workout-detail.component.html',
  styleUrl: './workout-detail.component.css',
})
export class WorkoutDetailComponent {
  private route = inject(ActivatedRoute);

  get workoutId(): number | null {
    const id = this.route.snapshot.queryParamMap.get('workoutId');
    return id ? Number(id) : null;
  }
}




