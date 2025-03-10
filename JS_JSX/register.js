// // Import Firebase functions
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   sendEmailVerification,
// } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
// Import Firebase functions
const { initializeApp } = require("firebase/app");
const {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} = require("firebase/auth");

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
  const fName = document.getElementById("first-name").value;
  const lName = document.getElementById("last-name").value;
  const errorMessage = document.getElementById("error-message");

  if (!email || !password || !fName || !lName) {
    errorMessage.textContent = "Please fill in all fields!";
    errorMessage.style.color = "red";
    return;
  }

  // Register the user in Firebase
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Firebase Registration Successful:", user);

      // Send verification email
      sendEmailVerification(user).then(() => {
        console.log("Verification email sent to:", user.email);
        errorMessage.textContent = "Verification email sent!";
        errorMessage.style.color = "green";
      });

      // Send user data to backend for MySQL storage
      fetch("http://localhost:4000/register-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          fName: fName,
          lName: lName,
          role: "Author", // Default role
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("MySQL Registration Successful:", data);
        })
        .catch((error) => {
          console.error("Error sending data to backend:", error);
        });

      // Redirect to login page after registration
      setTimeout(() => {
        window.location.href = "signin.html";
      }, 2000);
    })
    .catch((error) => {
      console.error("Firebase Registration Failed:", error.code, error.message);
      errorMessage.textContent = `Error: ${error.message}`;
      errorMessage.style.color = "red";
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
