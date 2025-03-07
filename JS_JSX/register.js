// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

// Firebase configuration
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
const auth = getAuth(app);

function registerUser() {
  console.log("Register button clicked!");

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

  if (!email || !password) {
    errorMessage.textContent = "Please enter email and password!";
    errorMessage.style.color = "black";
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Registration successful:", user);

      // Send verification email
      sendEmailVerification(user)
        .then(() => {
          errorMessage.textContent =
            "Verification email sent! Please check your inbox.";
          errorMessage.style.color = "green";
          console.log("Email verification sent to:", user.email);

          // Redirect to login page (optional)
          window.location.href = "signin.html";
        })
        .catch((error) => {
          console.error("Error sending verification email:", error);
          errorMessage.textContent =
            "Error: Could not send verification email.";
          errorMessage.style.color = "black";
        });
    })
    .catch((error) => {
      console.error("Registration failed:", error.code, error.message);
      errorMessage.textContent = `Error: ${error.message}`;
      errorMessage.style.color = "black";
    });
}

// Attach event listener when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const registerButton = document.getElementById("register");
  if (registerButton) {
    registerButton.addEventListener("click", registerUser);
  } else {
    console.error("Register button not found!");
  }
});
