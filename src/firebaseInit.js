// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1vYzrsIcXxWzk2LUevBD442Y0p-gBwiQ",
  authDomain: "blogging-app-882b8.firebaseapp.com",
  projectId: "blogging-app-882b8",
  storageBucket: "blogging-app-882b8.firebasestorage.app",
  messagingSenderId: "487153267684",
  appId: "1:487153267684:web:39258138e0b25c734ecdf1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db= getFirestore(app);