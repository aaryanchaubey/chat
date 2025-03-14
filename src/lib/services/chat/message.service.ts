import { db } from "../../config/firebase.config";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { Message } from "../../types/chat.types";
import { encryption } from "../../utils/encryption";

export class MessageService {
  async sendMessage(message: Omit<Message, "id">): Promise<string> {
    const encryptedContent = encryption.encrypt(message.content);
    const messageData = {
      ...message,
      content: encryptedContent,
      timestamp: Date.now(),
      isDeleted: false,
      isEdited: false,
      editHistory: [],
      type: message.type,
      replyTo: message.replyTo
        ? {
            id: message.replyTo.id,
            content: encryption.encrypt(message.replyTo.content),
            senderId: message.replyTo.senderId,
          }
        : null,
    };

    const docRef = await addDoc(collection(db, "messages"), messageData);
    return docRef.id;
  }

  async deleteAllMessages(senderId: string, receiverId: string): Promise<void> {
    const q = query(
      collection(db, "messages"),
      where("senderId", "in", [senderId, receiverId]),
      where("receiverId", "in", [senderId, receiverId])
    );

    const snapshot = await getDocs(q);
    const batch = db.batch();

    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }

  async updateMessageExpiry(
    messageId: string,
    expiryTime: number
  ): Promise<void> {
    await updateDoc(doc(db, "messages", messageId), {
      expiryTime,
    });
  }

  subscribeToMessages(
    senderId: string,
    receiverId: string,
    callback: (messages: Message[]) => void
  ) {
    const q = query(
      collection(db, "messages"),
      where("senderId", "in", [senderId, receiverId]),
      where("receiverId", "in", [senderId, receiverId]),
      orderBy("timestamp", "asc")
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          // Check if message should be expired
          if (data.expiryTime && Date.now() > data.expiryTime) {
            deleteDoc(doc.ref);
            return null;
          }
          return {
            id: doc.id,
            ...data,
            content: encryption.decrypt(data.content),
            replyTo: data.replyTo
              ? {
                  ...data.replyTo,
                  content: encryption.decrypt(data.replyTo.content), // Decrypt the replyTo content
                }
              : null,
          } as Message;
        })
        .filter(Boolean) as Message[];

      callback(messages);
    });
  }
}

export const messageService = new MessageService();
