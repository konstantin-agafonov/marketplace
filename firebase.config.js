import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
const firebaseConfig = {
    apiKey: "AIzaSyCk7x7PdY7OY_iVrTCqpuMTqRqF7jRdDl0",
    authDomain: "react-test-6fbd1.firebaseapp.com",
    projectId: "react-test-6fbd1",
    storageBucket: "react-test-6fbd1.appspot.com",
    messagingSenderId: "1098388088598",
    appId: "1:1098388088598:web:382edfa11a83425ae6d237"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()
