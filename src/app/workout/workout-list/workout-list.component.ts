import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-workout-list',
  imports: [RouterLink],
  templateUrl: './workout-list.component.html',
  styleUrl: './workout-list.component.css',
})
export class WorkoutListComponent {}

