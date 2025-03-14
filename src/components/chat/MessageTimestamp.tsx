import React from 'react';
import { chatUtils } from '@/lib/utils/chat.utils';

interface MessageTimestampProps {
  timestamp: number;
  isEdited?: boolean;
}

export function MessageTimestamp({ timestamp, isEdited }: MessageTimestampProps) {
  return (
    <span className="text-xs opacity-75">
      {chatUtils.formatMessageTimestamp(timestamp)}
      {isEdited && <span className="ml-1">(edited)</span>}
    </span>
  );
}