// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, OAuthProvider, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWwo1r2FVPzJxkCD4zUHmyGZrfGIRj0ls",
  authDomain: "alta-sertech.firebaseapp.com",
  projectId: "alta-sertech",
  storageBucket: "alta-sertech.firebasestorage.app",
  messagingSenderId: "483427737111",
  appId: "1:483427737111:web:a09cca06554a52d2d2c652"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const microsoftProvider = new OAuthProvider('microsoft.com');
const googleProvider = new GoogleAuthProvider();

export { auth, microsoftProvider, googleProvider };
