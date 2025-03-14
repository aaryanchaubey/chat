export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  type: 'text' | 'media' | 'alarm';
  mediaUrl?: string;
  isDeleted: boolean;
  deletedFor: string[];
  isEdited: boolean;
  editHistory: EditHistory[];
  expiryTime?: number | null;
  replyTo?: {
    id: string;
    content: string;
    senderId: string;
  } | null;
}

export interface EditHistory {
  content: string;
  timestamp: number;
}

export interface DeleteRequest {
  messageId: string;
  requesterId: string;
  timestamp: number;
  type: 'single' | 'all';
  status: 'pending' | 'approved' | 'rejected' | 'expired';
}

export interface ChatSettings {
  vanishMode: boolean;
  disappearingMessagesDuration: number | null;
}

export interface UserStatus {
  userId: string;
  isOnline: boolean;
  lastActive: number;
}

export interface DeleteCooldown {
  count: number;
  lastDeleteTime: number;
}