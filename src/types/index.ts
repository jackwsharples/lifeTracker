export interface Class {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  workItems: WorkItem[];
  importantDates: ImportantDate[];
}

export interface WorkItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  classId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImportantDate {
  id: string;
  title: string;
  date: string;
  description?: string;
  classId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Idea {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workout {
  id: string;
  type: 'PUSH' | 'PULL' | 'LEGS';
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  workoutId: string;
}

export interface BikeIdea {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface BikeEvent {
  id: string;
  title: string;
  date: string;
  description?: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export type ViewType = 'classes' | 'ideas' | 'workouts' | 'bike';