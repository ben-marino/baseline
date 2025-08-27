// Firebase configuration - compatible with the existing firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDYR9IdLUmLVBnq4RwcM6fX8JpE5EI8Bls",
  authDomain: "sociallyfed-55780.firebaseapp.com",
  projectId: "sociallyfed-55780",
  storageBucket: "sociallyfed-55780.appspot.com",
  messagingSenderId: "512204327023",
  appId: "1:512204327023:web:4682c5db3d42b5e1011468"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Use local storage instead of session storage
setPersistence(auth, browserLocalPersistence);

export { app, auth };