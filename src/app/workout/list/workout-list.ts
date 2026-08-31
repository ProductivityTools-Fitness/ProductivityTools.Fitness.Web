import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-workout-list',
  imports: [RouterLink],
  templateUrl: './workout-list.html',
  styleUrl: './workout-list.css',
})
export class WorkoutList {}
