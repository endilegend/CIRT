// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
// import {
//   getAuth,
//   signInWithEmailAndPassword,
// } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function Login() {
  console.log("Login button clicked");

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  // Ensure errorMessage is not null
  if (!errorMessage) {
    console.error("Error message element not found!");
    return;
  }

  // Clear previous error messages
  errorMessage.textContent = "";

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Check if email is verified
      if (!user.emailVerified) {
        errorMessage.textContent =
          "Please verify your email before logging in.";
        errorMessage.style.color = "black";
        console.warn("User email not verified:", user.email);
        return;
      }

      console.log("Login successful:", user);
      errorMessage.textContent = "Login successful!";
      errorMessage.style.color = "green";

      // Redirect to dashboard
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      console.error("Login failed:", error.code, error.message);
      errorMessage.textContent = `Error: ${error.message}`;
      errorMessage.style.color = "black";
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("sign-in");
  if (loginButton) {
    loginButton.addEventListener("click", Login);
  } else {
    console.error("Login button not found!");
  }
});
