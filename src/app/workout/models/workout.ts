import { Exercise } from '../../exercise/models/exercise';

export type WorkoutStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface WorkoutSet {
  id?: number;
  workoutExerciseId?: number;
  setNumber: number;
  weightKg: number;
  reps: number;
  prevWeightKg?: number | null;
  prevReps?: number | null;
  isCompleted: boolean;
  createdAt?: string | Date;
}

export interface WorkoutExercise {
  id?: number;
  workoutId?: number;
  exercise: Exercise;
  orderIndex: number;
  notes?: string | null;
  restTimerSeconds?: number | null;
  sets?: WorkoutSet[];
  createdAt?: string | Date;
}

export interface Workout {
  id?: number;
  userId?: number;
  title: string;
  startTime?: string | Date;
  endTime?: string | Date | null;
  durationSeconds?: number;
  status?: WorkoutStatus | string;
  notes?: string | null;
  exercises?: WorkoutExercise[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
