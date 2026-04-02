// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRr2JdCOFjBrtuQkgrk3FD9QtJGXVTeUc",
  authDomain: "mksukocloths.firebaseapp.com",
  projectId: "mksukocloths",
  storageBucket: "mksukocloths.firebasestorage.app",
  messagingSenderId: "837018362917",
  appId: "1:837018362917:web:6fe7711cd2e9c0dfeecbcc",
  measurementId: "G-22N28YGWDQ"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics (only on client side)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, storage, analytics };
