import { FirebaseOptions, getApps, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// const firebaseConfig: FirebaseOptions = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCqDCnp2XRtaqcWf2ODSyTMXyPWAmNmRaQ",
  authDomain: "ebuddy-test-85f77.firebaseapp.com",
  projectId: "ebuddy-test-85f77",
  storageBucket: "ebuddy-test-85f77.appspot.com",
  messagingSenderId: "1097686576230",
  appId: "1:1097686576230:web:8d77ed73cafda0ce67d1a7",
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const firebaseAuth = getAuth();

export const signUp = async (email: string, password: string) => {
  await createUserWithEmailAndPassword(firebaseAuth, email, password);
};

export const signIn = async (email: string, password: string) => {
  const res = await signInWithEmailAndPassword(firebaseAuth, email, password);
  return res;
};

export const logOut = async () => {
  await signOut(firebaseAuth);
};
