import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExerciseDbService } from './exercise-db.service';
import { ExternalSearchResult } from './models/external-search-result';

@Component({
  selector: 'app-exercise-db',
  imports: [FormsModule],
  templateUrl: './exercise-db.component.html',
  styleUrl: './exercise-db.component.css',
})
export class ExerciseDbComponent implements OnInit {
  private readonly exerciseDbService = inject(ExerciseDbService);

  searchQuery = '';
  searchResults = signal<ExternalSearchResult[]>([]);
  isLoading = signal<boolean>(false);
  hasSearched = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  importingIds = signal<Set<string>>(new Set());
  expandedInstructions = signal<Set<string>>(new Set());

  ngOnInit(): void {
    // Optionally trigger an initial search or leave empty until user searches
  }

  onSearch(): void {
    this.isLoading.set(true);
    this.hasSearched.set(true);
    this.errorMessage.set(null);

    this.exerciseDbService.searchExercises(this.searchQuery).subscribe({
      next: (results) => {
        this.searchResults.set(results);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error searching ExerciseDB:', err);
        this.errorMessage.set('Failed to search exercises. Please check your connection and try again.');
        this.isLoading.set(false);
      },
    });
  }

  importExercise(item: ExternalSearchResult): void {
    if (item.isAlreadyImported || this.importingIds().has(item.externalExerciseId)) {
      return;
    }

    this.importingIds.update((ids) => {
      const next = new Set(ids);
      next.add(item.externalExerciseId);
      return next;
    });

    this.exerciseDbService.importExercise(item.externalExerciseId).subscribe({
      next: (imported) => {
        this.searchResults.update((results) =>
          results.map((r) =>
            r.externalExerciseId === item.externalExerciseId
              ? { ...r, isAlreadyImported: true, localExerciseId: imported.id }
              : r,
          ),
        );
        this.importingIds.update((ids) => {
          const next = new Set(ids);
          next.delete(item.externalExerciseId);
          return next;
        });
      },
      error: (err) => {
        console.error('Error importing exercise:', err);
        alert('Failed to import exercise. Please try again.');
        this.importingIds.update((ids) => {
          const next = new Set(ids);
          next.delete(item.externalExerciseId);
          return next;
        });
      },
    });
  }

  toggleInstructions(exerciseId: string): void {
    this.expandedInstructions.update((set) => {
      const next = new Set(set);
      if (next.has(exerciseId)) {
        next.delete(exerciseId);
      } else {
        next.add(exerciseId);
      }
      return next;
    });
  }
}
