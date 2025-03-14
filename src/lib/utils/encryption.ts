import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key'; // In production, this should be stored securely

export const encryption = {
  encrypt: (text: string): string => {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  },

  decrypt: (ciphertext: string): string => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
};