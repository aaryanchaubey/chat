export const CHAT_CONSTANTS = {
  MAX_DELETES: 10,
  COOLDOWN_DURATION: 2 * 60 * 1000, // 2 minutes in milliseconds
  EDIT_TIME_LIMIT: 5 * 60 * 1000, // 5 minutes in milliseconds
  MESSAGE_TYPES: {
    TEXT: 'text',
    MEDIA: 'media',
    ALARM: 'alarm',
  } as const,
} as const;