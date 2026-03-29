import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCIdFBrSl6yEuPb8CNyXZEdQLf-sDvuluQ",
  authDomain: "wg-putzplan-8f373.firebaseapp.com",
  databaseURL: "https://wg-putzplan-8f373-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wg-putzplan-8f373",
  storageBucket: "wg-putzplan-8f373.firebasestorage.app",
  messagingSenderId: "546563600292",
  appId: "1:546563600292:web:a11ba5871a5774e357db31",
  measurementId: "G-0H979NWGTV"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
