export interface HevyImportRequest {
  'access-token'?: string;
}

export interface HevyImportResponse {
  totalFetched: number;
  workoutsImported: number;
  workoutsSkipped: number;
  exercisesCreated: number;
  message: string;
  importedTitles: string[];
}
