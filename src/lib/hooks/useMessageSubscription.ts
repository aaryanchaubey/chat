import { useEffect } from 'react';
import { messageService } from '../services/chat/message.service';
import { Message } from '../types/chat.types';

export function useMessageSubscription(
  senderId: string | undefined,
  receiverId: string | undefined,
  onMessagesUpdate: (messages: Message[]) => void
) {
  useEffect(() => {
    if (!senderId || !receiverId) return;

    const unsubscribe = messageService.subscribeToMessages(
      senderId,
      receiverId,
      onMessagesUpdate
    );

    return () => unsubscribe();
  }, [senderId, receiverId, onMessagesUpdate]);
}