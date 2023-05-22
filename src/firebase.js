import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { addDoc,where, orderBy, onSnapshot, query,updateDoc } from 'firebase/firestore';
import {   doc, getDoc } from "firebase/firestore";

import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  // Configuration Firebase
  // apiKey: "AIzaSyDocDOorcRBahU_uethYjyFqLCjP_CW9OM",
  // authDomain: "twitter-clone-f6077.firebaseapp.com",
  // projectId: "twitter-clone-f6077",
  // storageBucket: "twitter-clone-f6077.appspot.com",
  // messagingSenderId: "136550487896",
  // appId: "1:136550487896:web:9032ad3d7a4a52dca9372d"



  apiKey: "AIzaSyDw9JOcK_GF-Dq0seL6zYj1nLwrSVj9O0c",
  authDomain: "projetapprentissage-f7974.firebaseapp.com",
  projectId: "projetapprentissage-f7974",
  storageBucket: "projetapprentissage-f7974.appspot.com",
  messagingSenderId: "486293146898",
  appId: "1:486293146898:web:6da1a2e37f43df300cf7cb",
  measurementId: "G-BV2QRR9VP4"
};

// Initialise l'application Firebase
const app = initializeApp(firebaseConfig);

// Récupère les instances de Firebase que vous souhaitez utiliser
const auth = getAuth(app);
const firestore = getFirestore(app);
const database = getDatabase(app);
const storage = getStorage(app);
// const postsRef = collection(firestore, 'posts');


const postsCollection = collection(firestore, 'posts');

export {

  auth,
  firestore,
  database,
  storage,
  postsCollection,
  collection,
  addDoc,
  orderBy,
  onSnapshot,
  query,
  where,
  updateDoc
};
// Exporte les instances de Firebase
// export { auth, postsRef, firestore, database, storage };
export default app;
