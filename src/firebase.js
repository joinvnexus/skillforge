// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  verifyBeforeUpdateEmail
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAawZVqmwPokKFP5BnJfwu43mDTtAEn6dM",
  authDomain: "times-course.firebaseapp.com",
  projectId: "times-course",
  storageBucket: "times-course.appspot.com", // Updated storage bucket
  messagingSenderId: "845498003640",
  appId: "1:845498003640:web:e41c9cf7425f6bb9f7044d",
  measurementId: "G-4ML8YCJXM5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Auth State Listener (optional helper)
const setupAuthListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Export all Firebase services
export {
  auth,
  db,
  storage,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  verifyBeforeUpdateEmail,
  setupAuthListener
};

// For debugging (optional)
if (process.env.NODE_ENV === 'development') {
  window.firebase = { auth, db, storage };
}