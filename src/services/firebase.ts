import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getDatabase, type Database } from 'firebase/database';
import { getAuth, type Auth } from 'firebase/auth';

// Firebase configuration from Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoConfigKeyForKhelShalaRealtimeDb',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'khelshala-demo.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://khelshala-demo-default-rtdb.firebaseio.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'khelshala-demo',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'khelshala-demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:demo123456789',
};

// Singleton initialization
export const isConfigured = Boolean(import.meta.env.VITE_FIREBASE_API_KEY);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let rtdb: Database | null = null;
let auth: Auth | null = null;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  if (app) {
    db = getFirestore(app);
    rtdb = getDatabase(app);
    auth = getAuth(app);
  }
} catch (err) {
  console.warn('[Firebase] Running in local reactive pub/sub mode (Firebase SDK initialized with fallback credentials):', err);
}

export { app, db, rtdb, auth };
