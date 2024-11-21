import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDoc,
  getDocs,
  addDoc,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOYW9i3kwPDVIh6Q81u-ngVVnfmfMG8co",
  authDomain: "quiz-melhoria-second.firebaseapp.com",
  projectId: "quiz-melhoria-second",
  storageBucket: "quiz-melhoria-second.firebasestorage.app",
  messagingSenderId: "590523938442",
  appId: "1:590523938442:web:9286259f7924e0527d1f73",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Add data to Firestore (generic)
 * @param {string} collectionName - The Firestore collection name.
 * @param {string} docName - (Optional) Document name. If not provided, auto-generates one.
 * @param {Object} data - The data to be added.
 *
 * para usar essa função, você pode fazer algo como:
 *
 * const docId = await addData(this.collectionName, this.docName || null, data);
 *
 * passando o data com os dados
 */
const addData = async (collectionName, docName = null, data) => {
  try {
    let docRef;
    if (docName) {
      // If document name is provided, use it
      docRef = doc(db, collectionName, docName);
      await setDoc(docRef, data);
    } else {
      // Auto-generate document ID
      docRef = await addDoc(collection(db, collectionName), data);
    }
    console.log("Document written with ID:", docName || docRef.id);
    return docName || docRef.id;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};

/**
 * Get data from Firestore (generic)
 * @param {string} collectionName - The Firestore collection name.
 * @param {string} docName - (Optional) Document name. If not provided, fetches all documents in the collection.
 *
 * para usar essa função, você pode fazer algo como:
 *
 * const data = await getData(this.collectionName, this.docName || null);
 *
 *  passando o data com os dados
 */
const getData = async (collectionName, docName = null) => {
  try {
    if (docName) {
      // Get specific document
      const docRef = doc(db, collectionName, docName);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        return docSnap.data();
      } else {
        console.log("No such document!");
        return null;
      }
    } else {
      // Get all documents in the collection
      const querySnapshot = await getDocs(collection(db, collectionName));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      console.log("Collection data:", data);
      return data;
    }
  } catch (error) {
    console.error("Error getting document(s):", error);
    throw error;
  }
};

export { db, addData, getData };
