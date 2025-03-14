import React, { useState } from 'react';
import { Message } from '../../lib/types/chat.types';
import { Button } from '../ui/button';
import { Trash2, Edit2, X } from 'lucide-react';
import { Input } from '../ui/input';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  onDelete: (messageId: string) => void;
  onEdit: (messageId: string, newContent: string) => void;
}

export function MessageBubble({
  message,
  isOwnMessage,
  onDelete,
  onEdit
}: MessageBubbleProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const handleEdit = async () => {
    try {
      await onEdit(message.id, editContent);
      setIsEditing(false);
    } catch (error) {
      console.error('Edit failed:', error);
    }
  };

  return (
    <div 
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <div
        className={`relative max-w-[70%] rounded-lg p-3 ${
          isOwnMessage ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-900'
        }`}
      >
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-end space-x-2">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setIsEditing(false)}
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
              <Button 
                size="sm" 
                onClick={handleEdit}
                className="h-6"
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p>{message.content}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs opacity-75">
                {format(message.timestamp, 'HH:mm')}
                {message.isEdited && <span className="ml-1">(edited)</span>}
              </span>
              {isOwnMessage && showOptions && (
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => onDelete(message.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}