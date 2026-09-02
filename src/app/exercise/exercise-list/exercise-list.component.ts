import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciseService } from '../exercise.service';
import { Exercise } from '../models/exercise';
import { WorkoutService } from '../../workout/workout.service';

@Component({
  selector: 'app-exercise-list',
  imports: [],
  templateUrl: './exercise-list.component.html',
  styleUrl: './exercise-list.component.css',
})
export class ExerciseListComponent implements OnInit {
  exerciseList = signal<Exercise[]>([]);
  selectedExerciseIds = signal<Set<number>>(new Set());

  constructor(
    private exerciseService: ExerciseService,
    private workoutService: WorkoutService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.exerciseService.getExerciseList().subscribe((exercises) => {
      console.log('exercise list: ' + exercises.length);
      this.exerciseList.set(exercises);
    });
  }

  toggleExercise(id: number) {
    this.selectedExerciseIds.update((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  saveExercises() {
    const workoutIdParam = this.route.snapshot.queryParamMap.get('workoutId');
    const workoutId = workoutIdParam ? Number(workoutIdParam) : 1;
    const exerciseListArray = Array.from(this.selectedExerciseIds());

    this.workoutService.updateExerciseList(workoutId, exerciseListArray).subscribe({
      next: () => {
        console.log('Saved exercises for workout', workoutId);
        this.router.navigate(['/workouts/detail'], {
          queryParams: { workoutId },
        });
      },
      error: (err) => console.error('Error saving exercises:', err),
    });
  }
}




