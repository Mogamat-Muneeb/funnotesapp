import React, { useState, useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Notes from "../src/elements/Notes";
import "./App.css";
import { auth } from "./services/firebase";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NoteDetail from "../src/elements/NoteDetail";

function App() {
  auth.languageCode = "it";
  const provider = new GoogleAuthProvider();
  const store = JSON.parse(localStorage.getItem("Todo"));
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [verifiedUser, setVerifiedUser] = useState(storedUser);
  const [listItems, setListItems] = useState(() => {
    if (store) {
      return store;
    } else {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("Todo", JSON.stringify(listItems));
  }, [listItems]);
  useEffect(() => {
    if (verifiedUser) {
      localStorage.setItem("user", JSON.stringify(verifiedUser));
    }
  }, [verifiedUser]);

  let signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setVerifiedUser(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(error, errorCode);
      });
  };

  if (!verifiedUser) {
    return (
      <div className="flex content-center justify-center w-screen h-screen p-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <img
            src="https://i.postimg.cc/MHchWw1t/Multi-device-targeting.gif"
            alt=""
          />
          <h1 className="text-2xl font-bold text-center">Fun Notes</h1>
          <button
            className="bg-[#1D1D1D]  text-white rounded h-[45px] w-[160px] mt-4 font-medium shadow-lg"
            onClick={() => signInWithGoogle()}
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/notes/:id" element={<NoteDetail />} />
        <Route path="/" element={<Notes verifiedUser={verifiedUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
