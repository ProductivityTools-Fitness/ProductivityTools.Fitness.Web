export interface Exercise {
  id: number;
  userId?: number | null;
  name: string;
  category?: string | null;
  primaryMuscle?: string | null;
  secondaryMuscles?: string | null;
  iconUrl?: string | null;
  isSystem: boolean;
  createdAt?: string | Date;
}