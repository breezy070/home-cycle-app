// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "homecyclehome-e11a8.firebaseapp.com",
  projectId: "homecyclehome-e11a8",
  storageBucket: "homecyclehome-e11a8.firebasestorage.app",
  messagingSenderId: "101212627328",
  appId: "1:101212627328:web:e91176ab691d08670b6165"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);