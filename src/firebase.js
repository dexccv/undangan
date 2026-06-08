import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAMKj34dJ3jt8Q_uW3rQ6Pn3kypiLiS3OA",
  authDomain: "undangan-5cf2f.firebaseapp.com",
  projectId: "undangan-5cf2f",
  storageBucket: "undangan-5cf2f.firebasestorage.app",
  messagingSenderId: "156698309976",
  appId: "1:156698309976:web:26aea66e4ba22cdfe2212d",
  measurementId: "G-889VC8X9K4"
};

export const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);
export const auth = getAuth(app);
