import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Hello } from './console/hello/hello';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Hello],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ProductivityTools.Fitness.Web');
}
