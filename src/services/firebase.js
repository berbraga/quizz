import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  
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



const fetchUserResults = async (userId) => {
  try {
    console.log("ENTROU NA FUNÇÃO");
    const quizzesRef = collection(db, "quizzes"); // Referência à coleção
    const querySnapshot = await getDocs(quizzesRef); // Obtém todos os documentos da coleção "quizzes"

    const userResults = [];

    querySnapshot.forEach((doc) => {
      const quiz = doc.data(); // Obtém os dados do documento
      console.log("Quiz encontrado:", quiz);

      // Certifique-se de que 'results' existe antes de tentar acessá-lo
      if (quiz.results) {
        const userQuizResult = quiz.results.find((result) => result.userId === userId);

        if (userQuizResult) {
          userResults.push({
            name: quiz.name || "Sem Nome",
            level: quiz.level || "Sem Nível",
            accuracy: userQuizResult.accuracy || 0,
            correct: userQuizResult.correct || 0,
            incorrect: userQuizResult.incorrect || 0,
            timestamp: userQuizResult.timestamp || "Sem Data",
          });
        }
      }
    });

    console.log("Resultados do usuário:", userResults);
    return userResults;
  } catch (error) {
    console.error("Erro ao buscar resultados:", error);
    return [];
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
/**
 * Check if a document exists in Firestore
 * @param {string} collectionName - The Firestore collection name.
 * @param {string} docName - Document name to check.
 * @returns {boolean} - True if the document exists, false otherwise.
 */
const doesDocumentExist = async (collectionName, docName) => {
  try {
    const docRef = doc(db, collectionName, docName);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error("Error checking document existence:", error);
    throw error;
  }
};

/**
 * Check if a specific field value exists in any document of a collection
 * @param {string} collectionName - The Firestore collection name.
 * @param {string} fieldName - The field to check for.
 * @param {any} value - The value to search for.
 * @returns {boolean} - True if the value exists, false otherwise.
 */
const doesFieldValueExist = async (collectionName, fieldName, value) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    for (const doc of querySnapshot.docs) {
      if (doc.data()[fieldName] === value) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error checking field value existence:", error);
    throw error;
  }
};

const fetchAllQuizzes = async () => {
  try {
    const snapshot = await getDocs(collection(db,"quizzes"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Erro ao buscar quizzes:", error);
    throw error;
  }
};

const fetchAllUsers = async () => {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw error;
  }
};

export { db, addData, getData, doesDocumentExist, doesFieldValueExist,fetchUserResults,fetchAllQuizzes, fetchAllUsers };
