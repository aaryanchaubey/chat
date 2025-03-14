import React, { useEffect, useState } from 'react';
import { MessageList } from '@/components/chat/MessageList';
import { MessageInput } from '@/components/chat/MessageInput';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { VanishMode } from '@/components/chat/features/VanishMode';
import { DisappearingMessages } from '@/components/chat/features/DisappearingMessages';
import { DeleteAllPrompt } from '@/components/chat/features/DeleteAllPrompt';
import { useChatStore } from '@/lib/store/chat.store';
import { useAuthStore } from '@/lib/store/auth.store';
import { Alert } from '@/components/ui/alert';
import { MediaPreview } from '@/components/chat/MediaPreview';

interface Message {
  id: string;
  content: string;
  type: 'text' | 'media';
  replyTo?: string;
}
export function Chat() {
  const { user } = useAuthStore();
  const {
    messages,
    error,
    settings,
    sendMessage,
    deleteMessage,
    editMessage,
    requestDeleteAll,
    confirmDeleteAll,
    toggleVanishMode,
    setDisappearingMessages,
    subscribeToMessages,
    setError
  } = useChatStore();

  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [deleteTimeLeft, setDeleteTimeLeft] = useState(30);
  const [showSettings, setShowSettings] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<{ url: string; type: string } | null>(null);
  const [replyToMessage, setReplyToMessage] = useState<{ id: string; content: string; senderId: string } | null>(null);

  useEffect(() => {
    if (!user?.id || !user?.partnerId) return;
  
    const unsubscribe = subscribeToMessages(user.id, user.partnerId);
    return () => unsubscribe();
  }, [user?.id, user?.partnerId, subscribeToMessages]);

  useEffect(() => {
    if (showDeletePrompt) {
      const timer = setInterval(() => {
        setDeleteTimeLeft((prev) => {
          if (prev <= 1) {
            setShowDeletePrompt(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showDeletePrompt]);

  const handleSendMessage = (content: string, type: 'text' | 'media', replyTo?: { id: string; content: string; senderId: string }, mediaType?: string) => {
    if (!user?.id || !user?.partnerId) return;
    if (type === 'media') {
      // Show a preview if required for media
      setMediaPreview({ url: content, type: mediaType || 'file' });
    } else {
      sendMessage(content, user.id, user.partnerId, replyTo, type, mediaType);
    }
    setReplyToMessage(null); // Clear reply state after sending
  };

  const handleSendMedia = () => {
    if (mediaPreview && user?.id && user?.partnerId) {
      sendMessage(mediaPreview.url, user.id, user.partnerId, 'media', mediaPreview.type);
      setMediaPreview(null); // Clear preview after sending
    }
  };

  if (!user?.partnerId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Please connect with a partner to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {error && (
        <Alert variant="destructive" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <ChatHeader
        partnerName={user.partnerId}
        partnerStatus={{ isOnline: true, lastActive: Date.now() }}
        onVanishMode={toggleVanishMode}
        onDisappearingMessages={() => setShowSettings(true)}
        onDeleteAll={() => {
          if (user?.id && user?.partnerId) {
            requestDeleteAll(user.id, user.partnerId);
            setShowDeletePrompt(true);
          }
        }}
        settings={settings}
      />

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4">
            <VanishMode
              isActive={settings.vanishMode}
              onToggle={toggleVanishMode}
            />
            <DisappearingMessages
              isActive={!!settings.disappearingMessagesDuration}
              duration={settings.disappearingMessagesDuration}
              onSelect={setDisappearingMessages}
            />
          </div>
        </div>
      )}

      <DeleteAllPrompt
        isOpen={showDeletePrompt}
        onConfirm={() => {
          if (user?.id && user?.partnerId) {
            confirmDeleteAll(user.id, user.partnerId);
          }
          setShowDeletePrompt(false);
        }}
        onCancel={() => setShowDeletePrompt(false)}
        timeLeft={deleteTimeLeft * 1000}
      />

      <MessageList
        messages={messages}
        currentUserId={user.id}
        onDeleteMessage={(messageId: string) => deleteMessage(messageId, user.id)}
        onEditMessage={(messageId: string, newContent: string) => editMessage(messageId, newContent, user.id)}
        onReplyMessage={(messageId: string) => {
          console.log("Replying to message", messageId);
          const parentMessage = messages.find(
            (msg: Message) => msg.id === messageId
          );
          if (parentMessage) {
            setReplyToMessage({
              id: parentMessage.id,
              content: parentMessage.content,
              senderId: parentMessage.senderId
            });
          }
        }}
      />

      {mediaPreview && (
        <div className="mb-2">
          <MediaPreview url={mediaPreview.url} type={mediaPreview.type} />
          <div className="flex justify-end space-x-2">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={() => setMediaPreview(null)}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={handleSendMedia}
            >
              Send
            </button>
          </div>
        </div>
      )}
      <MessageInput
        onSendMessage={handleSendMessage}
        replyToMessage={replyToMessage}
        onCancelReply={() => setReplyToMessage(null)}
      />
    </div>
  );
}
