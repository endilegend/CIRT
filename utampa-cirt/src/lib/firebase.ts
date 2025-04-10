import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCj7ll6PomPGDKNx981w6HJu3IB97inDKY",
  authDomain: "cirt-9d13f.firebaseapp.com",
  databaseURL: "https://cirt-9d13f-default-rtdb.firebaseio.com",
  projectId: "cirt-9d13f",
  storageBucket: "cirt-9d13f.firebasestorage.app",
  messagingSenderId: "934697913147",
  appId: "1:934697913147:web:b07dce427e2dc31204c51e",
  measurementId: "G-XYDPTRCE75",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
