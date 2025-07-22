// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp
} from "firebase/firestore";

// ✅ Your Firebase config (DO NOT CHANGE unless keys are regenerated)
const firebaseConfig = {
  apiKey: "AIzaSyAg78jChADeBui6WkwyHiHVd6djCRvuBAY",
  authDomain: "celebal-shipment.firebaseapp.com",
  projectId: "celebal-shipment",
  storageBucket: "celebal-shipment.appspot.com",
  messagingSenderId: "481757537492",
  appId: "1:481757537492:web:1ca7f9c8206238157f0741",
  measurementId: "G-J4GVFP9JGN"
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 🔑 Firebase Authentication
export const auth = getAuth(app);
auth.languageCode = 'en'; // Optional

// 📦 Firebase Firestore
export const db = getFirestore(app);

// 🧪 Optional: Attach to browser console for testing
if (typeof window !== "undefined") {
  window.db = db;
  window.addDoc = addDoc;
  window.collection = collection;
  window.Timestamp = Timestamp;
}
