// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyAb5xzuiY7QmP3XNxL35w3Vq5dwa3Dqfoc",
   authDomain: "tarefas-7f377.firebaseapp.com",
   projectId: "tarefas-7f377",
   storageBucket: "tarefas-7f377.appspot.com",
   messagingSenderId: "1040122763950",
   appId: "1:1040122763950:web:a7b71b15f67731bfd0eb3f",
   measurementId: "G-V9WVHT41C2",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db };
