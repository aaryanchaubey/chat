import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task } from '../types/user.types';
import { STORAGE_KEYS } from '../config/constants';

interface TasksState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasksByCoupleId: (coupleId: string) => Task[];
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, { ...task, id: crypto.randomUUID() }],
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      getTasksByCoupleId: (coupleId) =>
        get().tasks.filter((task) => task.coupleId === coupleId),
    }),
    {
      name: STORAGE_KEYS.TASKS,
    }
  )
);