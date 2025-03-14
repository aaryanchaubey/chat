import React from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

interface VanishModeProps {
  isActive: boolean;
  onToggle: () => void;
}

export function VanishMode({ isActive, onToggle }: VanishModeProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
      <div className="flex items-center space-x-2">
        <span>Vanish Mode</span>
        {isActive && <Lightbulb className="w-4 h-4 text-yellow-400" />}
      </div>
      <Button
        variant={isActive ? "destructive" : "outline"}
        size="sm"
        onClick={onToggle}
      >
        {isActive ? 'Turn Off' : 'Turn On'}
      </Button>
    </div>
  );
}