// Import Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

// Firebase configuration (same as in register.js)
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

// Update UI with logged in user info
const userInfoDiv = document.getElementById("userInfo");
onAuthStateChanged(auth, (user) => {
  if (user) {
    userInfoDiv.textContent = `Logged in as: ${user.email}`;
  } else {
    userInfoDiv.textContent = "Not logged in.";
  }
});

// Drag and Drop Setup
const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("uploadButton");
const articleTypeSelect = document.getElementById("articleType");
const keywordsInput = document.getElementById("keywords");
const messageDiv = document.getElementById("message");

let selectedFile = null;

// Prevent default drag behaviors
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropzone.addEventListener(
    eventName,
    (e) => {
      e.preventDefault();
      e.stopPropagation();
    },
    false
  );
});

// Highlight dropzone on drag events
["dragenter", "dragover"].forEach((eventName) => {
  dropzone.addEventListener(
    eventName,
    () => {
      dropzone.classList.add("hover");
    },
    false
  );
});
["dragleave", "drop"].forEach((eventName) => {
  dropzone.addEventListener(
    eventName,
    () => {
      dropzone.classList.remove("hover");
    },
    false
  );
});

// Handle file drop
dropzone.addEventListener("drop", (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;
  if (files.length > 0) {
    selectedFile = files[0];
    if (selectedFile.type !== "application/pdf") {
      messageDiv.textContent = "Please upload a PDF file.";
      selectedFile = null;
      return;
    }
    messageDiv.textContent = `Selected file: ${selectedFile.name}`;
  }
});

// Clicking dropzone opens file picker
dropzone.addEventListener("click", () => {
  fileInput.click();
});

// Handle file selection via file input
fileInput.addEventListener("change", (e) => {
  if (e.target.files.length > 0) {
    selectedFile = e.target.files[0];
    if (selectedFile.type !== "application/pdf") {
      messageDiv.textContent = "Please upload a PDF file.";
      selectedFile = null;
      return;
    }
    messageDiv.textContent = `Selected file: ${selectedFile.name}`;
  }
});

// Upload the file when the Upload button is clicked
uploadButton.addEventListener("click", () => {
  if (!selectedFile) {
    messageDiv.textContent = "No file selected.";
    return;
  }

  // Get the currently logged in user
  const currentUser = auth.currentUser;
  if (!currentUser) {
    messageDiv.textContent = "Please log in to upload an article.";
    return;
  }
  const authorId = currentUser.uid; // Use the logged in user's UID

  const articleType = articleTypeSelect.value;
  // Get keywords as entered by the user (e.g., "tech, science, research")
  const keywords = keywordsInput.value.trim();

  // Prepare FormData for file upload
  const formData = new FormData();
  formData.append("file", selectedFile);
  formData.append("author_id", authorId);
  formData.append("type", articleType);
  // Append keywords (the backend should parse this field)
  formData.append("keywords", keywords);

  // Send POST request to the backend upload endpoint
  fetch("http://localhost:4000/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      messageDiv.textContent = data.message || "Upload successful!";
    })
    .catch((error) => {
      console.error("Error uploading file:", error);
      messageDiv.textContent = "Error uploading file.";
    });
});
