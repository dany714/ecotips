import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, addDoc, getDocs, updateDoc, deleteDoc, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

// Configmde Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCSL1t25Yh5wPP0QnQX1TFwaCcRuZrHwwI",
  authDomain: "ecotips-118ae.firebaseapp.com",
  projectId: "ecotips-118ae",
  storageBucket: "ecotips-118ae.firebasestorage.app",
  messagingSenderId: "405899930117",
  appId: "1:405899930117:web:facb6aa000fc227f2aca6c",
  measurementId: "G-9K5FRMDWDX"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export const tipsCollection = collection(db, 'tips');
export const commentsCollection = collection(db, 'comments');
export const notificationsCollection = collection(db, 'notifications');
export const usersCollection = collection(db, 'users');
