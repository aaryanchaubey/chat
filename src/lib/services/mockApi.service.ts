import { Message, DeleteRequest, UserStatus } from '../types/chat.types';
import { EventEmitter } from '../utils/EventEmitter';

class MockApiService extends EventEmitter {
  private static instance: MockApiService;
  private messages: Message[] = [];
  private userStatuses: Record<string, UserStatus> = {};

  private constructor() {
    super();
    // Initialize with some mock data
    this.userStatuses = {
      komal: { userId: 'komal', isOnline: true, lastActive: Date.now() },
      aaryan: { userId: 'aaryan', isOnline: true, lastActive: Date.now() },
      suraj: { userId: 'suraj', isOnline: true, lastActive: Date.now() },
      arushi: { userId: 'arushi', isOnline: true, lastActive: Date.now() },
    };
  }

  static getInstance(): MockApiService {
    if (!MockApiService.instance) {
      MockApiService.instance = new MockApiService();
    }
    return MockApiService.instance;
  }

  connect(userId: string) {
    this.updateUserStatus(userId, true);
    return this;
  }

  disconnect(userId: string) {
    this.updateUserStatus(userId, false);
  }

  sendMessage(message: Message) {
    this.messages.push(message);
    setTimeout(() => {
      this.emit('message', message);
    }, 100);
  }

  deleteMessage(messageId: string, userId: string, forEveryone: boolean) {
    const request: DeleteRequest = {
      messageId,
      requesterId: userId,
      timestamp: Date.now(),
      type: 'single',
      status: 'pending',
    };

    // Simulate server processing
    setTimeout(() => {
      this.emit('deleteRequest', request);
      
      // Auto-approve after 2 seconds for demo
      setTimeout(() => {
        this.emit('deleteResponse', { ...request, status: 'approved' });
      }, 2000);
    }, 100);
  }

  private updateUserStatus(userId: string, isOnline: boolean) {
    this.userStatuses[userId] = {
      userId,
      isOnline,
      lastActive: Date.now(),
    };
    this.emit('userStatus', this.userStatuses[userId]);
  }
}

export const mockApiService = MockApiService.getInstance();