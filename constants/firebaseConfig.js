import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjH78s7FikP899VTqKxmxRqGpy3-0NAb4",
  authDomain: "budgetbuddy-2310d.firebaseapp.com",
  projectId: "budgetbuddy-2310d",
  storageBucket: "budgetbuddy-2310d.firebasestorage.app",
  messagingSenderId: "724169539576",
  appId: "1:724169539576:web:65e48990492dceeb6ee00d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);    