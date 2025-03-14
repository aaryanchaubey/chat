import React, { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Send, PlusCircle } from 'lucide-react';
import { storage } from '../../lib/config/firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface MessageInputProps {
  onSendMessage: (content: string, type: 'text' | 'media', mediaType?: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSendMessage(message, 'text');
    setMessage('');
  };

  const handleFileUpload = async (file: File) => {
    try {
      console.log('Uploading file:', file.name);
      const mediaType = file.type.startsWith('image/')
        ? 'image'
        : file.type.startsWith('video/')
        ? 'video'
        : 'file';
  
      const storageRef = ref(storage, `chat-media/${Date.now()}-${file.name}`);
      console.log('Storage reference created:', storageRef.fullPath);
  
      await uploadBytes(storageRef, file);
      console.log('File uploaded successfully.');
  
      const url = await getDownloadURL(storageRef);
      console.log('Download URL obtained:', url);
  
      onSendMessage(url, 'media', mediaType);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  // const handleFileUpload = async (file: File) => {
  //   try {
  //     const mediaType = file.type.startsWith('image/')
  //       ? 'image'
  //       : file.type.startsWith('video/')
  //       ? 'video'
  //       : 'file';
  //     const storageRef = ref(storage, `chat-media/${Date.now()}-${file.name}`);
  //     await uploadBytes(storageRef, file);
  //     const url = await getDownloadURL(storageRef);
  //     onSendMessage(url, 'media', mediaType);
  //   } catch (error) {
  //     console.error('Upload failed:', error);
  //   }
  // };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
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