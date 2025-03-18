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

function registerUser(event) {
  event.preventDefault(); // Prevent form submission

  console.log("Register button clicked!");

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const fName = document.getElementById("first-name").value;
  const lName = document.getElementById("last-name").value;
  const errorMessage = document.getElementById("error-message");

  console.log("Email:", email);
  console.log("Password:", password);
  console.log("First Name:", fName);
  console.log("Last Name:", lName);

  if (!email || !password || !fName || !lName) {
    errorMessage.textContent = "Please fill in all fields!";
    errorMessage.style.color = "red";
    return;
  }

  if (password !== confirmPassword) {
    errorMessage.textContent = "Passwords do not match!";
    errorMessage.style.color = "red";
    return;
  }

  // Register the user in Firebase
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Firebase Registration Successful:", user);

      // Send verification email
      sendEmailVerification(user)
        .then(() => {
          console.log("Verification email sent to:", user.email);
          errorMessage.textContent = "Verification email sent!";
          errorMessage.style.color = "green";
        })
        .catch((err) => {
          console.error("Error sending verification email:", err);
        });

      // Send user data to backend for PostgreSQL storage
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
          // No need to send role since backend sets it as "Author"
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("PostgreSQL Registration Successful:", data);
          errorMessage.textContent = "Registration successful!";
          errorMessage.style.color = "green";
          setTimeout(() => {
            window.location.href = "signin.html";
          }, 2000);
        })
        .catch((error) => {
          console.error("Error sending data to backend:", error);
          errorMessage.textContent = "Registration unsuccessful!";
          errorMessage.style.color = "red";
          setTimeout(() => {
            errorMessage.textContent = "";
          }, 2000);
        });
    })
    .catch((error) => {
      console.error("Firebase Registration Failed:", error.code, error.message);
      errorMessage.textContent = `Error: ${error.message}`;
      errorMessage.style.color = "red";
      setTimeout(() => {
        errorMessage.textContent = "";
      }, 2000);
    });
}

// Attach event listener when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.querySelector("form");
  if (registerForm) {
    registerForm.addEventListener("submit", registerUser);
  } else {
    console.error("Register form not found!");
  }
});
