import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAgB-JjSV9-h21z__cETsdPb16ht8Hk2Sc",
  authDomain: "togetherness-app.firebaseapp.com",
  projectId: "togetherness-app",
  // storageBucket: "togetherness-app.firebasestorage.app",
  storageBucket: "togetherness-app.appspot.com",
  messagingSenderId: "560370976752",
  appId: "1:560370976752:web:35bdfe04d5e34db8513f35"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);