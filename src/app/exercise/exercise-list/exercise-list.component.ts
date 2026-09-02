import { Component, ngOnInit } from '@angular/core';
import {ExerciseService} from '../exercise.service'

@Component({
  selector: 'app-exercise-list',
  imports: [],
  templateUrl: './exercise-list.component.html',
  styleUrl: './exercise-list.component.css',
})
export class ExerciseListComponent:ngOnInit{

  exerciseList = signal<Exercise[]>([]);

  constructor(private exerciseService: ExerciseService) {}

  ngOnInit() {
    this.exerciseService.getExerciseList().subscribe((exercises)=> {
      console.log('exercise list: ' + exercises.length);
      this.exerciseList.set(exercises);
    });
  }
}


