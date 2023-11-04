import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCeNTVohZr3rKS6LDV6bDefEO9OU30qHa0",
  authDomain: "chat-4e5c8.firebaseapp.com",
  projectId: "chat-4e5c8",
  storageBucket: "chat-4e5c8.appspot.com",
  messagingSenderId: "640342134706",
  appId: "1:640342134706:web:238a1a81b9aab551369eab"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
