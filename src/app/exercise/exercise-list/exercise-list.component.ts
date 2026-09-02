import { Component, OnInit, signal } from '@angular/core';
import { ExerciseService } from '../exercise.service';
import { Exercise } from '../models/exercise';

@Component({
  selector: 'app-exercise-list',
  imports: [],
  templateUrl: './exercise-list.component.html',
  styleUrl: './exercise-list.component.css',
})
export class ExerciseListComponent implements OnInit {
  exerciseList = signal<Exercise[]>([]);
  selectedExerciseIds=signal<Set<number>>(new Set());

  constructor(private exerciseService: ExerciseService) {}

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
    
  }
}



