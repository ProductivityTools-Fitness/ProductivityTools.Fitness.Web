import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HevyImportService } from './hevy-import.service';
import { HevyImportRequest, HevyImportResponse } from './models/hevy-import';

const STORAGE_KEY = 'pt_hevy_access_token';

@Component({
  selector: 'app-hevy-import',
  imports: [FormsModule, RouterLink],
  templateUrl: './hevy-import.component.html',
  styleUrl: './hevy-import.component.css',
})
export class HevyImportComponent implements OnInit {
  private readonly hevyImportService = inject(HevyImportService);

  accessToken = '';
  showToken = signal<boolean>(false);
  rememberToken = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  result = signal<HevyImportResponse | null>(null);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const savedToken = localStorage.getItem(STORAGE_KEY);
    if (savedToken) {
      this.accessToken = savedToken;
      this.rememberToken.set(true);
    }
  }

  toggleShowToken(): void {
    this.showToken.update((v) => !v);
  }

  onImport(): void {
    if (this.isLoading()) return;

    this.errorMessage.set(null);
    this.result.set(null);

    const token = this.accessToken.trim();

    if (this.rememberToken() && token) {
      localStorage.setItem(STORAGE_KEY, token);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }

    const request: HevyImportRequest | undefined = token
      ? { 'access-token': token }
      : undefined;

    this.isLoading.set(true);

    this.hevyImportService.importFromHevy(request).subscribe({
      next: (response) => {
        this.result.set(response);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error importing from Hevy:', err);
        const msg =
          err?.error?.message ||
          err?.message ||
          'Failed to import workouts from Hevy. Please verify your access token and try again.';
        this.errorMessage.set(msg);
        this.isLoading.set(false);
      },
    });
  }

  clearResults(): void {
    this.result.set(null);
    this.errorMessage.set(null);
  }
}
