import React, { useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Navbar from "../src/elements/Navbar";
import Notes from "../src/elements/Notes";
import "./App.css";
// import Man from "./assets/sammy-line-man-marks-completed-tasks-in-a-notebook.png";
import ToggleOn from "./assets/toggle-button.png";
import ToggleOff from "./assets/off-button.png";
// import TravellingMan from "./assets/3d-plastic-people-boy-with-map-going-on-a-hike.png";
import Modal from "./Modal/Modal";
// import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "./services/firebase";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NoteDetail from '../src/elements/NoteDetail'

function App() {
  auth.languageCode = "it";
  const provider = new GoogleAuthProvider();
  const [dark, setDark] = useState(false);
  // const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  let [show, setShow] = useState(false);
  // let [verifiedUser, setVerifiedUser] = useState(null);
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

  let username = verifiedUser && verifiedUser.displayName.split(" ")[0];
  // console.log(verifiedUser, "verifiedUser");

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
        // console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(error, errorCode);
      });
  };

  let handleChange = (e) => {
    setListItems([...listItems, e]);
    setShow(!show);
  };
  let closeToggle = () => setShow(!show);

  let darkMode = () => {
    setDark((prev) => !prev);
  };

  // console.log(verifiedUser);

  if (!verifiedUser) {
    return (
      <div className="flex content-center justify-center w-screen h-screen p-4">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-center">Fun Notes</h1>
          <button
            className="bg-gradient-to-r from-[#021578] to-[#019AD9] text-white rounded h-[45px] w-[160px] mt-4 font-medium shadow-lg"
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
      <Route path="/notes/:id" element={ <NoteDetail />}/>
 
      <Route path="/"  element={    <Notes verifiedUser={verifiedUser} /> }/>
        {/* <div className={` ${dark ? "dark" : ""}   `}>
          <div className=""> */}
            {/* <Navbar verifiedUser={verifiedUser}/> */}
            {/* <div className="w-screen h-screen"> */}
           
            {/* </div> */}
          {/* </div>
        </div> */}

    {/* <div className={` ${dark ? "dark" : ""}   `}>
      <div className="">
        <Navbar verifiedUser={verifiedUser}/>
        <div className="w-screen h-screen">
          <Notes verifiedUser={verifiedUser} />
        </div>
      </div>
    </div> */}

      </Routes>
    </Router>
  );
}

export default App;
