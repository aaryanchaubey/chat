import React from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

interface DisappearingMessagesProps {
  isActive: boolean;
  duration: number | null;
  onSelect: (duration: number | null) => void;
}

export function DisappearingMessages({ isActive, duration, onSelect }: DisappearingMessagesProps) {
  const durations = [
    { label: 'Off', value: null },
    { label: '1 hour', value: 3600000 },
    { label: '3 hours', value: 10800000 },
    { label: '24 hours', value: 86400000 },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span>Disappearing Messages</span>
          {isActive && <Lightbulb className="w-4 h-4 text-yellow-400" />}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {durations.map((option) => (
          <Button
            key={option.label}
            variant={duration === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect(option.value)}
            className="w-full"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}