import { create } from 'zustand';
import { Message, UserStatus, ChatSettings } from '../types/chat.types';
import { messageService } from '../services/chat/message.service';
import { messageActionsService } from '../services/chat/message-actions.service';

interface ChatState {
  messages: Message[];
  userStatuses: Record<string, UserStatus>;
  settings: ChatSettings;
  error: string | null;
  deleteRequestPending: boolean;
  sendMessage: (content: string, senderId: string, receiverId: string, replyTo?: { id: string; content: string; senderId: string }, type?: 'text' | 'media') => Promise<void>;
  deleteMessage: (messageId: string, userId: string) => Promise<void>;
  editMessage: (messageId: string, newContent: string, userId: string) => Promise<void>;
  requestDeleteAll: (senderId: string, receiverId: string) => Promise<void>;
  confirmDeleteAll: (senderId: string, receiverId: string) => Promise<void>;
  toggleVanishMode: () => void;
  setDisappearingMessages: (duration: number | null) => void;
  subscribeToMessages: (senderId: string, receiverId: string) => () => void;
  setMessages: (messages: Message[]) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  userStatuses: {},
  settings: {
    vanishMode: false,
    disappearingMessagesDuration: null,
  },
  error: null,
  deleteRequestPending: false,

  sendMessage: async (content, senderId, receiverId, replyTo?: { id: string; content: string; senderId: string }, type = 'text') => {
    try {
      const { settings } = get();
      const expiryTime = settings.disappearingMessagesDuration 
        ? Date.now() + settings.disappearingMessagesDuration 
        : null;

      await messageService.sendMessage({
        senderId,
        receiverId,
        content,
        timestamp: Date.now(),
        type,
        isDeleted: false,
        deletedFor: [],
        isEdited: false,
        editHistory: [],
        replyTo: replyTo || null,
        expiryTime
      });
    } catch (error) {
      console.log(error);
      set({ error: 'Failed to send message' });
    }
  },

  deleteMessage: async (messageId, userId) => {
    try {
      await messageActionsService.deleteMessage(messageId, userId);
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  editMessage: async (messageId, newContent, userId) => {
    try {
      await messageActionsService.editMessage(messageId, newContent, userId);
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  requestDeleteAll: async (senderId, receiverId) => {
    set({ deleteRequestPending: true });
    // Implement Firebase real-time database trigger for delete request
    setTimeout(() => {
      set({ deleteRequestPending: false });
    }, 30000);
  },

  confirmDeleteAll: async (senderId, receiverId) => {
    try {
      await messageService.deleteAllMessages(senderId, receiverId);
      set({ deleteRequestPending: false });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  toggleVanishMode: () => {
    set((state) => ({
      settings: {
        ...state.settings,
        vanishMode: !state.settings.vanishMode,
        disappearingMessagesDuration: null
      }
    }));
  },

  setDisappearingMessages: (duration) => {
    set((state) => ({
      settings: {
        ...state.settings,
        disappearingMessagesDuration: duration,
        vanishMode: false
      }
    }));
  },

  subscribeToMessages: (senderId, receiverId) => {
    const unsubscribe = messageService.subscribeToMessages(
      senderId,
      receiverId,
      (messages) => set({ messages })
    );
    return unsubscribe;
  },

  setMessages: (messages) => set({ messages }),
  setError: (error) => set({ error })
}));