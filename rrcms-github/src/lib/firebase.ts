import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Firebase configuration provided by user
const firebaseConfig = {
  apiKey: "AIzaSyC2Dx1J4_F_JUeZC_96Hg9yfq4k7aJ2cyg",
  authDomain: "lawyercasediarypro-f13ecd27.firebaseapp.com",
  projectId: "lawyercasediarypro-f13ecd27",
  storageBucket: "lawyercasediarypro-f13ecd27.firebasestorage.app",
  messagingSenderId: "413124660797",
  appId: "1:413124660797:web:c9022fd0ccc1ae3fdca454"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const database = getDatabase(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;
