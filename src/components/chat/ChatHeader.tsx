import React from 'react';
import { MoreVertical, Bell, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { UserStatus } from '@/lib/types/chat.types';
import { formatDistanceToNow } from 'date-fns';

interface ChatHeaderProps {
  partnerName: string;
  partnerStatus: UserStatus;
  onVanishMode: () => void;
  onDisappearingMessages: () => void;
  onDeleteAll: () => void;
}

export function ChatHeader({
  partnerName,
  partnerStatus,
  onVanishMode,
  onDisappearingMessages,
  onDeleteAll,
}: ChatHeaderProps) {
  const [showOptions, setShowOptions] = React.useState(false);

  const getStatusText = () => {
    if (partnerStatus.isOnline) return 'Online';
    return `Last seen ${formatDistanceToNow(partnerStatus.lastActive)} ago`;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b">
      <div>
        <h2 className="text-lg font-semibold">{partnerName}</h2>
        <p className="text-sm text-gray-500">{getStatusText()}</p>
      </div>

      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowOptions(!showOptions)}
        >
          <MoreVertical className="w-5 h-5" />
        </Button>

        {showOptions && (
          <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-1">
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={onVanishMode}
              >
                <Bell className="w-4 h-4 mr-2" />
                Vanish Mode
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={onDisappearingMessages}
              >
                <Bell className="w-4 h-4 mr-2" />
                Disappearing Messages
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={onDeleteAll}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete All Messages
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}