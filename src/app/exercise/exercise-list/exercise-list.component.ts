import { Component, OnInit, signal } from '@angular/core';
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
  selectedExerciseIds=signal<Set<number>>(new Set());

  constructor(private exerciseService: ExerciseService,
    private workoutService: WorkoutService
  ) {}

  ngOnInit() {
    this.exerciseService.getExerciseList().subscribe((exercises) => {
      console.log('exercise list: ' + exercises.length);
      this.exerciseList.set(exercises);
    });
  }

  toggleExercise(id:number){
    if(this.selectedExerciseIds().has(id))
    {
      this.selectedExerciseIds().delete(id);
    }
    else
    {
      this.selectedExerciseIds().add(id);
    }
  }

  saveExercises(){
    let exerciseListArray= Array.from(this.selectedExerciseIds())
    this.workoutService.updateExerciseList(1,exerciseListArray)
  }
}



