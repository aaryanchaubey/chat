export const API_URL = 'https://api.togetherness.app';

export const STORAGE_KEYS = {
  AUTH: 'auth-storage',
  CHAT: 'chat-storage',
  HEALTH: 'health-storage',
  TASKS: 'tasks-storage',
} as const;

export const defaultUsers = {
  'komal@example.com': {
    id: 'komal',
    email: 'komal@example.com',
    name: 'Komal',
    role: 'female' as const,
    password: 'KomalChaubey',
    partnerId: 'aaryan'
  },
  'aaryan@example.com': {
    id: 'aaryan',
    email: 'aaryan@example.com',
    name: 'Aaryan',
    role: 'male' as const,
    password: 'AaryanChaubey',
    partnerId: 'komal'
  },
  'aarushi@example.com': {
    id: 'aarushi',
    email: 'aarushi@example.com',
    name: 'Aarushi',
    role: 'female' as const,
    password: 'AarushiSharma',
    partnerId: 'suraj'
  },
  'suraj@example.com': {
    id: 'suraj',
    email: 'suraj@example.com',
    name: 'Suraj',
    role: 'male' as const,
    password: 'SurajSharma',
    partnerId: 'aarushi'
  }
} as const;