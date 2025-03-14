export type UserRole = 'male' | 'female';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  partnerId?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface HealthData {
  menstrualCycle: {
    lastPeriod: string;
    cycleLength: number;
    periodLength: number;
  };
  mood: {
    date: string;
    rating: number;
    notes: string;
  }[];
  wellness: {
    sleep: number;
    stress: number;
    exercise: number;
    date: string;
  }[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  assignedTo: string[];
  category: 'shopping' | 'health' | 'relationship' | 'general';
  priority: 'low' | 'medium' | 'high';
  createdBy: string;
  coupleId: string;
}