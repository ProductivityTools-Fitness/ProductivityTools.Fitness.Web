export interface Exercise {
  id: number;
  externalExerciseId?: string | null;
  userId?: number | null;
  name: string;
  category?: string | null;
  bodyCategory?: string | null;
  equipmentCategory?: string | null;
  targetMuscle?: string | null;
  primaryMuscle?: string | null;
  secondaryMuscles?: string | string[] | null;
  instructions?: string[] | null;
  iconUrl?: string | null;
  gifUrl?: string | null;
  isSystem: boolean;
  createdAt?: string | Date;
}