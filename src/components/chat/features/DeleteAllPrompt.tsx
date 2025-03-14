import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

interface DeleteAllPromptProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  timeLeft: number;
}

export function DeleteAllPrompt({ isOpen, onConfirm, onCancel, timeLeft }: DeleteAllPromptProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-2">Delete All Messages?</h3>
        <p className="text-gray-600 mb-4">
          The other user has requested to delete all messages.
          You have {Math.ceil(timeLeft / 1000)} seconds to respond.
        </p>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete All
          </Button>
        </div>
      </div>
    </div>
  );
}