import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC556xEWQ6bn9dXxnND7zn22K_YMjqGG5k",
  authDomain: "ai-profielwerkstuk.firebaseapp.com",
  projectId: "ai-profielwerkstuk",
  storageBucket: "ai-profielwerkstuk.appspot.com",
  messagingSenderId: "458512798569",
  appId: "1:458512798569:web:edd96f8243b2c18a54e3f8"
};

const app = initializeApp(firebaseConfig);

const firebase = getFirestore(app);

export { firebase };