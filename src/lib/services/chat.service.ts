import { db } from '../config/firebase.config';
import { collection, addDoc, query, where, orderBy, onSnapshot, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { Message } from '../types/chat.types';
import { encryption } from '../utils/encryption';

export class ChatService {
  private static instance: ChatService;
  private deleteCooldowns: Map<string, { count: number; lastDeleteTime: number }> = new Map();

  private constructor() {}

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  async sendMessage(message: Omit<Message, 'id'>): Promise<string> {
    const encryptedContent = encryption.encrypt(message.content);
    const messageData = {
      ...message,
      content: encryptedContent,
      timestamp: Date.now(),
      isDeleted: false,
      isEdited: false,
      editHistory: []
    };

    const docRef = await addDoc(collection(db, 'messages'), messageData);
    return docRef.id;
  }

  subscribeToMessages(senderId: string, receiverId: string, callback: (messages: Message[]) => void) {
    const q = query(
      collection(db, 'messages'),
      where('senderId', 'in', [senderId, receiverId]),
      where('receiverId', 'in', [senderId, receiverId]),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          content: encryption.decrypt(data.content)
        } as Message;
      });
      callback(messages);
    });
  }

  async deleteMessage(messageId: string, userId: string): Promise<boolean> {
    const cooldown = this.deleteCooldowns.get(userId) || { count: 0, lastDeleteTime: 0 };
    const now = Date.now();

    if (now - cooldown.lastDeleteTime >= 2 * 60 * 1000) {
      cooldown.count = 0;
    }

    if (cooldown.count >= 5) {
      throw new Error('Delete limit reached. Please wait 2 minutes.');
    }

    try {
      await deleteDoc(doc(db, 'messages', messageId));
      
      this.deleteCooldowns.set(userId, {
        count: cooldown.count + 1,
        lastDeleteTime: now
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  }

  async editMessage(messageId: string, newContent: string, userId: string): Promise<boolean> {
    try {
      const messageRef = doc(db, 'messages', messageId);
      const messageSnap = await getDoc(messageRef);
      
      if (!messageSnap.exists()) return false;
      
      const messageData = messageSnap.data();
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      
      if (messageData.timestamp < fiveMinutesAgo) {
        throw new Error('Messages can only be edited within 5 minutes of sending');
      }

      const encryptedContent = encryption.encrypt(newContent);
      await updateDoc(messageRef, {
        content: encryptedContent,
        isEdited: true,
        editHistory: [...(messageData.editHistory || []), {
          content: messageData.content,
          timestamp: Date.now()
        }]
      });
      
      return true;
    } catch (error) {
      console.error('Error editing message:', error);
      return false;
    }
  }
}

export const chatService = ChatService.getInstance();