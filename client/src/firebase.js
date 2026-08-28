import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAa-WtoNOa8EMvhDXU6ohNwp-8aNt90Wa0',
  authDomain: 'whiskerworld-ea08d.firebaseapp.com',
  projectId: 'whiskerworld-ea08d',
  storageBucket: 'whiskerworld-ea08d.firebasestorage.app',
  messagingSenderId: '326002184069',
  appId: '1:326002184069:web:36f5702752cbaa07a83eec',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
