import { useEffect } from 'react';
import { useChatStore } from '../store/chat.store';
import { useAuthStore } from '../store/auth.store';

export function useChat() {
  const { user } = useAuthStore();
  const { messages, connect, disconnect, sendMessage, deleteMessage, userStatuses } = useChatStore();

  useEffect(() => {
    if (user?.id) {
      connect(user.id);
    }
    return () => disconnect();
  }, [user?.id, connect, disconnect]);

  const handleSendMessage = (content: string) => {
    if (!user?.id || !user?.partnerId) return;
    sendMessage(content, user.id, user.partnerId);
  };

  const handleDeleteMessage = (messageId: string, forEveryone: boolean) => {
    if (!user?.id) return;
    deleteMessage(messageId, user.id, forEveryone);
  };

  const getPartnerStatus = () => {
    if (!user?.partnerId) return null;
    return userStatuses[user.partnerId] || {
      isOnline: false,
      lastActive: Date.now(),
    };
  };

  return {
    user,
    messages,
    partnerStatus: getPartnerStatus(),
    sendMessage: handleSendMessage,
    deleteMessage: handleDeleteMessage,
  };
}