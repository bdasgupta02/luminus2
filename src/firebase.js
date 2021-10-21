// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import 'firebase/compat/auth'
import 'firebase/compat/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-EGTkNpKCE66-tZrVFKecruRY656TrQ8",
  authDomain: "luminus2-ff3b5.firebaseapp.com",
  projectId: "luminus2-ff3b5",
  storageBucket: "luminus2-ff3b5.appspot.com",
  messagingSenderId: "555299429938",
  appId: "1:555299429938:web:c3171d0ef397d0cb09662b",
  measurementId: "G-K4KCKBJS91"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = app.firestore()
export const auth = app.auth()