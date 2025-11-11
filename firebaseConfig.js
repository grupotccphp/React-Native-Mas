import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBHYkDHd4Lev2U49WUzkd6ZUfndG0YhpBc",
  authDomain: "projeto-mas-cc4fc.firebaseapp.com",
  projectId: "projeto-mas-cc4fc",
  storageBucket: "projeto-mas-cc4fc.appspot.com",
  messagingSenderId: "426470483722",
  appId: "1:426470483722:web:e9f5af898fa7b648fbfcf3",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
