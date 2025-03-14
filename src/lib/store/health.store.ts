import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HealthData } from '../types/user.types';
import { STORAGE_KEYS } from '../config/constants';

interface HealthState {
  healthData: HealthData;
  updateMenstrualData: (data: HealthData['menstrualCycle']) => void;
  addMoodEntry: (entry: HealthData['mood'][0]) => void;
  addWellnessEntry: (entry: HealthData['wellness'][0]) => void;
}

const initialHealthData: HealthData = {
  menstrualCycle: {
    lastPeriod: '',
    cycleLength: 28,
    periodLength: 5,
  },
  mood: [],
  wellness: [],
};

export const useHealthStore = create<HealthState>()(
  persist(
    (set) => ({
      healthData: initialHealthData,
      updateMenstrualData: (data) =>
        set((state) => ({
          healthData: {
            ...state.healthData,
            menstrualCycle: data,
          },
        })),
      addMoodEntry: (entry) =>
        set((state) => ({
          healthData: {
            ...state.healthData,
            mood: [...state.healthData.mood, entry],
          },
        })),
      addWellnessEntry: (entry) =>
        set((state) => ({
          healthData: {
            ...state.healthData,
            wellness: [...state.healthData.wellness, entry],
          },
        })),
    }),
    {
      name: STORAGE_KEYS.HEALTH,
    }
  )
);