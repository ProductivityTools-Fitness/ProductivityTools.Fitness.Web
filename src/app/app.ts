import { Component, signal } from '@angular/core';
import { Hello } from './console/hello/hello';
import { Appname } from './console/appname/appname';

@Component({
  selector: 'app-root',
  imports: [Hello, Appname],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ProductivityTools.Fitness.Web');
}
