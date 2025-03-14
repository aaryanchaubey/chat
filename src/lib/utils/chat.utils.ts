import { DeleteCooldown } from '../types/chat.types';
import { CHAT_CONSTANTS } from '../constants/chat.constants';

export const chatUtils = {
  checkDeleteCooldown(cooldown: DeleteCooldown | undefined): { canDelete: boolean; remainingTime?: number } {
    if (!cooldown) {
      return { canDelete: true };
    }

    const now = Date.now();
    const timeSinceLastDelete = now - cooldown.lastDeleteTime;

    // Reset cooldown if enough time has passed
    if (timeSinceLastDelete >= CHAT_CONSTANTS.COOLDOWN_DURATION) {
      return { canDelete: true };
    }

    // Check if under delete limit
    if (cooldown.count < CHAT_CONSTANTS.MAX_DELETES) {
      return { canDelete: true };
    }

    // Calculate remaining cooldown time
    const remainingTime = Math.ceil(
      (CHAT_CONSTANTS.COOLDOWN_DURATION - timeSinceLastDelete) / 1000
    );

    return { canDelete: false, remainingTime };
  },

  // canEditMessage(messageTimestamp: number): boolean {
  //   return Date.now() - messageTimestamp <= CHAT_CONSTANTS.EDIT_TIME_LIMIT;
  // },

  canEditMessage: (timestamp: number) => {
    const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;
    return timestamp >= fifteenMinutesAgo;
  },

  formatMessageTimestamp(timestamp: number): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(timestamp);
  },
};