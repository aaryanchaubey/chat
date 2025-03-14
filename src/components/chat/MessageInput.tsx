import React, { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Send, PlusCircle, X } from 'lucide-react';
import { storage } from '../../lib/config/firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface MessageInputProps {
  onSendMessage: (content: string, type: 'text' | 'media', replyTo?: { id: string; content: string; senderId: string }, mediaType?: string) => void;
  replyToMessage?: { id: string; content: string; senderId: string };
  onCancelReply: () => void;
}

export function MessageInput({ onSendMessage, replyToMessage, onCancelReply }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSendMessage(message, 'text', replyToMessage);
    setMessage('');
    onCancelReply();
  };

  const handleFileUpload = async (file: File) => {
    try {
      const mediaType = file.type.startsWith('image/')
        ? 'image'
        : file.type.startsWith('video/')
        ? 'video'
        : 'file';

      const storageRef = ref(storage, `chat-media/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);

      const url = await getDownloadURL(storageRef);

      onSendMessage(url, 'media', replyToMessage, mediaType);
      onCancelReply();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

    return (
      <form onSubmit={handleSubmit} className="p-4 border-t">
        {replyToMessage && (
          <div className="p-2 mb-2 bg-gray-100 rounded-t-md flex items-center justify-between text-sm">
            <span>
               <span className="font-medium">{replyToMessage.content}</span>
            </span>
            <button
              type="button"
              onClick={onCancelReply}
              className="text-gray-500 hover:text-gray-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <PlusCircle className="w-5 h-5 text-gray-500" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!message.trim()}>
            <Send className="w-5 h-5" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,video/*,application/pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
        </div>
      </form>
    );
  }
  