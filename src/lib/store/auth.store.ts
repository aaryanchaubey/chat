import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types/user.types';
import { defaultUsers, STORAGE_KEYS } from '../config/constants';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  linkPartner: (partnerEmail: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async ({ email, password }) => {
        const user = defaultUsers[email as keyof typeof defaultUsers];
        
        if (!user || user.password !== password) {
          throw new Error('Invalid credentials');
        }

        const { password: _, ...userWithoutPassword } = user;
        set({ user: userWithoutPassword, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      linkPartner: async (partnerEmail: string) => {
        const partner = defaultUsers[partnerEmail as keyof typeof defaultUsers];
        
        if (!partner || partner.role !== 'male') {
          throw new Error('Invalid partner account');
        }

        set((state) => ({
          user: state.user ? { ...state.user, partnerId: partner.id } : null,
        }));
      },
    }),
    {
      name: STORAGE_KEYS.AUTH,
    }
  )
);