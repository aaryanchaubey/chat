import { db } from '../../config/firebase.config';
import { doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { encryption } from '../../utils/encryption';
import { DeleteCooldownManager } from './delete-cooldown.manager';

export class MessageActionsService {
  private cooldownManager = new DeleteCooldownManager();

  async deleteMessage(messageId: string, userId: string): Promise<boolean> {
    this.cooldownManager.validateDeleteRequest(userId);

    try {
      await deleteDoc(doc(db, 'messages', messageId));
      this.cooldownManager.recordDeletion(userId);
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  }

  async editMessage(messageId: string, newContent: string): Promise<boolean> {
    try {
      console.log('Editing message:', { messageId, newContent });
  
      const messageRef = doc(db, 'messages', messageId);
      const messageSnap = await getDoc(messageRef);
  
      if (!messageSnap.exists()) {
        console.error('Message not found.');
        return false;
      }
  
      console.log('Message data retrieved:', messageSnap.data());
  
      const messageData = messageSnap.data();
      this.validateEditTimeWindow(messageData.timestamp);
  
      const encryptedContent = encryption.encrypt(newContent);
      console.log('Encrypted content:', encryptedContent);
  
      await updateDoc(messageRef, {
        content: encryptedContent,
        isEdited: true,
        editHistory: [...(messageData.editHistory || []), {
          content: messageData.content,
          timestamp: Date.now()
        }]
      });
  
      console.log('Message successfully updated.');
      return true;
    } catch (error) {
      console.error('Error editing message:', error);
      return false;
    }
  }  

  private validateEditTimeWindow(timestamp: number) {
    const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;
    if (timestamp < fifteenMinutesAgo) {
      throw new Error('Messages can only be edited within 15 minutes of sending');
    }
  }
}

export const messageActionsService = new MessageActionsService();