import { Component, signal } from '@angular/core';
import { Hello } from './console/hello/hello';
import { Appname } from './console/appname/appname';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Hello, Appname],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ProductivityTools.Fitness.Web');
}
