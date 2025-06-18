// Replace with your actual config from Firebase console
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAa_8j7dOgVEdEmk1hYqplYHMAz4y0G-Zc",
  authDomain: "reel-meals-9311f.firebaseapp.com",
  projectId: "reel-meals-9311f",
  storageBucket: "reel-meals-9311f.firebasestorage.app",
  messagingSenderId: "173631167242",
  appId: "1:173631167242:web:3a6384a3f4199bfcab78f3",
  measurementId: "G-T4YGLQR9S4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
