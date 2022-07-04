import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBqCrcQVMH8YXRRP-iEqRqGqpIJMuTrne0",
  authDomain: "my-todo-app-10b45.firebaseapp.com",
  projectId: "my-todo-app-10b45",
  storageBucket: "my-todo-app-10b45.appspot.com",
  messagingSenderId: "477224811116",
  appId: "1:477224811116:web:5e9d41a885dbf301937649",
};

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)