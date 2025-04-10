import React from 'react';
import { Message } from '../../lib/types/chat.types';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  onDeleteMessage: (messageId: string, forEveryone: boolean) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
}

export function MessageList({
  messages,
  currentUserId,
  onDeleteMessage,
  onEditMessage
}: MessageListProps) {
  const handleDelete = (messageId: string) => {
    // Wrap `onDeleteMessage` to provide a default value for `forEveryone`
    onDeleteMessage(messageId, false);
  };
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isOwnMessage={message.senderId === currentUserId}
          onDelete={handleDelete}
          onEdit={(messageId, newContent) => onEditMessage(messageId, newContent)}
        />
      ))}
    </div>
  );
}