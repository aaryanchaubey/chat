import { io, Socket } from 'socket.io-client';
import { API_URL } from '../config/constants';

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(userId: string) {
    if (this.socket?.connected) return;

    this.socket = io(API_URL, {
      autoConnect: false,
      auth: {
        userId,
      },
    });

    this.socket.connect();
    return this.socket;
  }

  disconnect() {
    if (this.socket?.connected) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = SocketService.getInstance();