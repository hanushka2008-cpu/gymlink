/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export interface ExerciseVariant {
  id: string;
  name: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  videoUrl: string;
  sets: number;
  reps: string;
  thumbnailUrl: string;
  variants?: ExerciseVariant[];
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  level: FitnessLevel;
  day: number;
  exercises: Exercise[];
}

export interface LogEntry {
  date: string;
  sets: {
    reps: number;
    weight: number;
  }[];
}

export interface UserProgress {
  userId: string;
  level: FitnessLevel;
  completedWorkouts: string[]; 
  workoutLogs: {
    [exerciseId: string]: LogEntry[];
  };
}

export interface SubscriptionStatus {
  trialStartDate: string | null;
  isSubscribed: boolean;
  daysRemaining: number;
  isExpired: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'admin' | 'member';
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  isRead?: boolean;
}
