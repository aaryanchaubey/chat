import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Image, Film } from 'lucide-react';
import { storage } from '@/lib/config/firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface MediaUploadProps {
  onUpload: (url: string, type: 'image' | 'video') => void;
}

export function MediaUpload({ onUpload }: MediaUploadProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File, type: 'image' | 'video') => {
    try {
      const storageRef = ref(storage, `chat-media/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      onUpload(url, type);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="flex space-x-2">
      <input
        type="file"
        ref={imageInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file, 'image');
        }}
      />
      <input
        type="file"
        ref={videoInputRef}
        className="hidden"
        accept="video/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file, 'video');
        }}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => imageInputRef.current?.click()}
      >
        <Image className="w-5 h-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => videoInputRef.current?.click()}
      >
        <Film className="w-5 h-5" />
      </Button>
    </div>
  );
}