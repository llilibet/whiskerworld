// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Os valores vêm de variáveis de ambiente (VITE_FIREBASE_*), para que o preview
// possa usar um projeto Firebase de testes. Sem elas, usa o projeto de produção.
const env = import.meta.env;
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyAa-WtoNOa8EMvhDXU6ohNwp-8aNt90Wa0",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "whiskerworld-ea08d.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "whiskerworld-ea08d",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "whiskerworld-ea08d.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "326002184069",
  appId: env.VITE_FIREBASE_APP_ID || "1:326002184069:web:36f5702752cbaa07a83eec",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || "G-D14P5H8YKG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, googleProvider };
