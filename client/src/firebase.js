// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Configuração do projeto Firebase de produção.
const configProducao = {
  apiKey: "AIzaSyAa-WtoNOa8EMvhDXU6ohNwp-8aNt90Wa0",
  authDomain: "whiskerworld-ea08d.firebaseapp.com",
  projectId: "whiskerworld-ea08d",
  storageBucket: "whiskerworld-ea08d.firebasestorage.app",
  messagingSenderId: "326002184069",
  appId: "1:326002184069:web:36f5702752cbaa07a83eec",
  measurementId: "G-D14P5H8YKG"
};

// Se VITE_FIREBASE_PROJECT_ID estiver definida (por exemplo, no preview da
// Vercel), a configuração inteira vem das variáveis VITE_FIREBASE_*, sem
// misturar com valores de produção. Sem ela, usa o projeto de produção.
const env = import.meta.env;
const firebaseConfig = env.VITE_FIREBASE_PROJECT_ID
  ? {
      apiKey: env.VITE_FIREBASE_API_KEY,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: env.VITE_FIREBASE_APP_ID,
      measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || undefined
    }
  : configProducao;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// O Analytics só é ativado quando o projeto tem um measurementId (o projeto de
// testes não usa Analytics).
const analytics = firebaseConfig.measurementId ? getAnalytics(app) : null;
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, googleProvider };
