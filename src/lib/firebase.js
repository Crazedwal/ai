import { initializeApp } from "firebase/app"
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

const googleProvider = new GoogleAuthProvider()
const microsoftProvider = new OAuthProvider("microsoft.com")
microsoftProvider.setCustomParameters({ prompt: "select_account" })

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider)
export const signInWithMicrosoft = () => signInWithPopup(auth, microsoftProvider)
export const signInWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)
export const signUpWithEmail = (email, password, displayName) =>
  createUserWithEmailAndPassword(auth, email, password).then((cred) => {
    if (displayName) updateProfile(cred.user, { displayName })
    return cred
  })
export const logOut = () => signOut(auth)
export { onAuthStateChanged }
