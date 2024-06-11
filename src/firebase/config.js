// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyDDjwD0OJT1dZ4YlTGmLdamMXiDfSiOwR0",
  authDomain: "shwapno-expansion-tracker.firebaseapp.com",
  projectId: "shwapno-expansion-tracker",
  storageBucket: "shwapno-expansion-tracker.appspot.com",
  messagingSenderId: "475547711694",
  appId: "1:475547711694:web:a6c2bdf143b721cc3db89f"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const expansionDB = getStorage(app)