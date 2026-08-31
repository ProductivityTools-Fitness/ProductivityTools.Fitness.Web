import { Component, signal } from '@angular/core';
import { HelloComponent } from './console/hello/hello.component';
import { AppnameComponent } from './console/appname/appname.component';
import { RouterOutlet } from '@angular/router';
import { WorkoutList } from './workout/list/workout-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HelloComponent, AppnameComponent, WorkoutList],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly title = signal('ProductivityTools.Fitness.Web');
}

