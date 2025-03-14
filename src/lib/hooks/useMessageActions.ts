import { useState } from 'react';
import { messageActionsService } from '../services/chat/message-actions.service';

export function useMessageActions() {
  const [error, setError] = useState<string | null>(null);

  const handleDeleteMessage = async (messageId: string, userId: string) => {
    try {
      await messageActionsService.deleteMessage(messageId, userId);
      setError(null);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const handleEditMessage = async (messageId: string, newContent: string, userId: string) => {
    try {
      await messageActionsService.editMessage(messageId, newContent, userId);
      setError(null);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  return {
    error,
    handleDeleteMessage,
    handleEditMessage,
    clearError: () => setError(null)
  };
}