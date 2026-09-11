import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyAxmnZm4597RcMVQeJrby3HpuDfzYyTJoU",
  authDomain: "ptprojectsweb.firebaseapp.com",
  projectId: "ptprojectsweb",
  storageBucket: "ptprojectsweb.firebasestorage.app",
  messagingSenderId: "93484780890",
  appId: "1:93484780890:web:3ab29c5382fb58f79ff763"
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

