import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const missingKeys = (Object.keys(firebaseConfig) as (keyof typeof firebaseConfig)[])
  .filter((k) => !firebaseConfig[k])

export const configError = missingKeys.length
  ? new Error(`Missing Firebase config keys: ${missingKeys.join(', ')}. Set VITE_FIREBASE_* environment variables.`)
  : null

const app = configError ? null : initializeApp(firebaseConfig)

export const auth = app ? getAuth(app) : null!
export const db = app ? getFirestore(app) : null!
export const googleProvider = new GoogleAuthProvider()
