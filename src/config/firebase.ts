
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyD60UggWsgae7Q_M2VHqKb1D9Cgv7RfQ_I",
    authDomain: "lendsqr-3103c.firebaseapp.com",
    projectId: "lendsqr-3103c",
    storageBucket: "lendsqr-3103c.appspot.com",
    messagingSenderId: "958093871910",
    appId: "1:958093871910:web:3409ef5941a95dfda10fe7"
  
  };
  
  

// Initialize Firebase
const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
export { app, db, firebaseConfig };