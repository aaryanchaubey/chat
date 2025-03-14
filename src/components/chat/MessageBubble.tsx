import { useState } from 'react';
import { Message } from '../../lib/types/chat.types';
import { Button } from '../ui/button';
import { Trash2, Edit2, Reply, X } from 'lucide-react';
import { Input } from '../ui/input';
import { format } from 'date-fns';
import { useAuthStore } from '@/lib/store/auth.store';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  onDelete: (messageId: string) => void;
  onEdit: (messageId: string, newContent: string) => void;
  onReplyMessage: (messageId: string) => void;
}

export function MessageBubble({
  message,
  isOwnMessage,
  onDelete,
  onEdit,
  onReplyMessage,
}: MessageBubbleProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const { user } = useAuthStore();

  // Check if the message is within the 15-minute edit time window
  const isWithinEditWindow = Date.now() - message.timestamp <= 15 * 60 * 1000;

  const handleEdit = async () => {
    try {
      await onEdit(message.id, editContent);
      setIsEditing(false);
    } catch (error) {
      console.error('Edit failed:', error);
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if ((isOwnMessage && direction === 'left') || (!isOwnMessage && direction === 'right')) {
      onReplyMessage?.(message.id);
    }
  };

  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
      onTouchStart={(e) => {
        const startX = e.touches[0].clientX;
        e.target.addEventListener(
          'touchend',
          (event) => {
            const endEvent = event as TouchEvent; // Cast the event to TouchEvent
            const endX = endEvent.changedTouches[0].clientX;
            if (startX - endX > 50) handleSwipe('left');
            if (endX - startX > 50) handleSwipe('right');
          },
          { once: true }
        );
      }}
    >
      <div
        className={`relative max-w-[70%] rounded-lg p-3 ${isOwnMessage ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-900'
          }`}
      >
        {isEditing ? (
          <div className="space-y-2">
            {message.replyTo && (
              <div className="text-sm text-white-500 mb-1 border-l-2 pl-2">
              <div
                  className={`text-sm rounded-lg ${message.replyTo.senderId === user.name.toLowerCase()
                      ? 'p-2 bg-pink-500 text-white'
                      : 'p-2 bg-gray-200 text-gray-900'
                    }`}>
                  <div
                    className={`font-semibold text-xs ${message.replyTo.senderId === user.name.toLowerCase() ? 'text-white' : 'text-gray-700'
                      }`}>
                    {message.replyTo.senderId === user.name.toLowerCase() ? 'You' : message.replyTo.senderId}
                  </div>
                  <div className="text-sm">{message.replyTo.content}</div>
                </div>
            </div>
            )}
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full text-black" // Ensures the text color is black in edit mode
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
              <Button size="sm" onClick={handleEdit} className="h-6">
                Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            {message.replyTo && (
              <div className="text-sm text-white-500 mb-1 border-l-2 pl-2">
                <div
                  className={`text-sm rounded-lg ${message.replyTo.senderId === user.name.toLowerCase()
                      ? 'p-2 bg-pink-500 text-white'
                      : 'p-2 bg-gray-200 text-gray-900'
                    }`}>
                  <div
                    className={`font-semibold text-xs ${message.replyTo.senderId === user.name.toLowerCase() ? 'text-white' : 'text-gray-700'
                      }`}>
                    {message.replyTo.senderId === user.name.toLowerCase() ? 'You' : message.replyTo.senderId}
                  </div>
                  <div className="text-sm">{message.replyTo.content}</div>
                </div>
              </div>
            )}
            <p>{message.content}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs opacity-75">
                {format(message.timestamp, 'HH:mm')}
                {message.isEdited && <span className="ml-1">(edited)</span>}
              </span>
              {showOptions && (
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => onReplyMessage?.(message.id)}
                  >
                    <Reply className="w-3 h-3" />
                  </Button>
                  {isOwnMessage && (
                    <>
                      {isWithinEditWindow && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => onDelete(message.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
