//Recommended to put all firebase db access imports in own file and then import * as MyModule from /modules
//and then export the functions that call the {initializeApp etc }

import React from "react";
import "./App.css";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
// import "firebase/compat/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { useAuthState } from "./Components/Firebase";
import Channel from "./Components/Channel";



const firebaseApp = initializeApp({
  apiKey: "AIzaSyA8S6o6JmVhUvkc2qi_FOUqMGCwWUfmZyY",
  authDomain: "persistent-chat-app-react.firebaseapp.com",
  projectId: "persistent-chat-app-react",
  storageBucket: "persistent-chat-app-react.appspot.com",
  messagingSenderId: "144521392971",
  appId: "1:144521392971:web:fc628b1d4d996a82c06ece",
});

const db = getFirestore(firebaseApp);

function App() {
  const {user, initializing} = useAuthState(auth);

  const auth = getAuth(firebaseApp);

  const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const logInWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const logout = () => {
    signOut(auth);
  };

  if (initializing) return "Loading...";

  if (user) return <Channel user={user} />;

  return (
    <div>
      <header className="App-header"></header>
      <div className="flex items-center">
        {user ? <button onClick={logout}>Sign out</button> : null}
      </div>
      <section>
        <Channel user={user} db={db} />
      </section>
    </div>
  );
}

export default App;
