import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyDhpO3JsMjjJun6mEnGw_dgJvpUBOBZN4A",
  authDomain: "funnotesapp.firebaseapp.com",
  projectId: "funnotesapp",
  storageBucket: "funnotesapp.appspot.com",
  messagingSenderId: "493841646276",
  appId: "1:493841646276:web:678f12524697aa4349ff91",
  measurementId: "G-52GY0KNXQZ"
};


const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
export {db, storage};