// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//   "type": "commonjs", ... from package.json
//import { getAnalytics } from "./node_models/firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

console.log("LOADED THE CORRECT Login.js");

//const analytics = getAnalytics(app);
function Login() {
  // Add login functionality here
  alert("Login button clicked");
}

function Signup() {
  // Add signup functionality here
  alert("Signup button clicked");
}

function Test() {
  console.log("Starting Test");
}

var pic = document.querySelector(".section-two-right");
pic.onclick = Test;
