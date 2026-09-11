import { Component, inject, signal, effect } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  readonly authService = inject(AuthService);
  avatarLoadError = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.authService.currentUser();
      this.avatarLoadError.set(false);
    });
  }

  logout(): void {
    this.authService.logout();
  }
}




