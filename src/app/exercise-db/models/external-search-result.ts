export interface ExternalSearchResult {
  externalExerciseId: string;
  name: string;
  gifUrl?: string;
  bodyCategory?: string;
  equipmentCategory?: string;
  targetMuscle?: string;
  secondaryMuscles?: string[];
  instructions?: string[];
  isAlreadyImported: boolean;
  localExerciseId?: number | null;
}
