import React from 'react';
import { Button } from '../ui/button';
import { Trash2, Edit2 } from 'lucide-react';
import { chatUtils } from '../../lib/utils/chat.utils';

interface MessageOptionsProps {
  messageTimestamp: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function MessageOptions({ messageTimestamp, onEdit, onDelete }: MessageOptionsProps) {
  const canEdit = chatUtils.canEditMessage(messageTimestamp);

  return (
    <div className="flex items-center space-x-1">
      {canEdit && (
        <Button
          variant="ghost"
          size="sm"
          className="p-1"
          onClick={onEdit}
        >
          <Edit2 className="w-4 h-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        className="p-1"
        onClick={onDelete}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}