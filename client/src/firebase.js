// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAa-WtoNOa8EMvhDXU6ohNwp-8aNt90Wa0",
  authDomain: "whiskerworld-ea08d.firebaseapp.com",
  projectId: "whiskerworld-ea08d",
  storageBucket: "whiskerworld-ea08d.firebasestorage.app",
  messagingSenderId: "326002184069",
  appId: "1:326002184069:web:36f5702752cbaa07a83eec",
  measurementId: "G-D14P5H8YKG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, googleProvider };
