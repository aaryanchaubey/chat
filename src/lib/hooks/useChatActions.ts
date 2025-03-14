import { useState } from 'react';
import { useChatStore } from '../store/chat.store';
import { useAuthStore } from '../store/auth.store';
import { chatUtils } from '../utils/chat.utils';

export function useChatActions() {
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { deleteMessage, editMessage } = useChatStore();

  const handleDeleteMessage = async (messageId: string) => {
    if (!user?.id) return;

    try {
      await deleteMessage(messageId, user.id);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    if (!user?.id) return;

    try {
      await editMessage(messageId, newContent, user.id);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    error,
    handleDeleteMessage,
    handleEditMessage,
  };
}