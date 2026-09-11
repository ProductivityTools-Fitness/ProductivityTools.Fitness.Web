import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  avatarLoadError = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.authService.photoURL();
      this.avatarLoadError.set(false);
    });
  }

  async loginWithGoogle(): Promise<void> {
    this.errorMessage.set(null);
    this.isLoading.set(true);
    try {
      await this.authService.loginWithGoogle();
      this.navigateAfterLogin();
    } catch (err: unknown) {
      this.errorMessage.set(this.formatErrorMessage(err));
    } finally {
      this.isLoading.set(false);
    }
  }

  async logout(): Promise<void> {
    this.isLoading.set(true);
    try {
      await this.authService.logout();
    } catch (err: unknown) {
      this.errorMessage.set(this.formatErrorMessage(err));
    } finally {
      this.isLoading.set(false);
    }
  }

  private navigateAfterLogin(): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/workouts';
    this.router.navigateByUrl(returnUrl);
  }

  private formatErrorMessage(err: unknown): string {
    const code = (err as { code?: string })?.code;
    switch (code) {
      case 'auth/popup-closed-by-user':
        return 'Logowanie przez Google zostało anulowane.';
      case 'auth/popup-blocked':
        return 'Okno logowania zostało zablokowane przez przeglądarkę. Zezwól na wyskakujące okienka.';
      case 'auth/network-request-failed':
        return 'Błąd połączenia z siecią. Sprawdź połączenie i spróbuj ponownie.';
      default:
        return (err as { message?: string })?.message || 'Wystąpił błąd podczas logowania.';
    }
  }
}

