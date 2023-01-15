import React, { useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Navbar from '../src/elements/Navbar'
import Notes from '../src/elements/Notes'
import "./App.css";
// import Man from "./assets/sammy-line-man-marks-completed-tasks-in-a-notebook.png";
import ToggleOn from "./assets/toggle-button.png";
import ToggleOff from "./assets/off-button.png";
// import TravellingMan from "./assets/3d-plastic-people-boy-with-map-going-on-a-hike.png";
import Modal from "./Modal/Modal";
// import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "./services/firebase";

function App() {
  auth.languageCode = "it";
  const provider = new GoogleAuthProvider();
  let [dark, setDark] = useState(false);
  // const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  let [show, setShow] = useState(false);
  let [verifiedUser, setVerifiedUser] = useState(null);
  let store = JSON.parse(localStorage.getItem("Todo"));
  let [listItems, setListItems] = useState(() => {
    if (store) {
      return store;
    } else {
      return [];
    }
  });

  let username = verifiedUser && verifiedUser.displayName.split(" ")[0];

  useEffect(() => {
    localStorage.setItem("Todo", JSON.stringify(listItems));
  }, [listItems]);

  let signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setVerifiedUser(user);
        console.log(user);
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

  console.log(verifiedUser);

  if (!verifiedUser) {
    return (
      <div className="w-screen p-4 justify-center content-center  flex h-screen">
        <div className="w-11/12 flex flex-col justify-center content-center">
          <div className="w-full p-4 h-2/3 flex content-center justify-center">
            <div className="max-w-[80%] m-auto h-full">
              {/* <img src={Man} alt="" className="w-full" /> */}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h1 className="font-bold text-center text-xl mb-4">Fun Note</h1>
            <button
                       className='bg-black text-white rounded h-[45px] w-[160px] mt-4'
              onClick={() => signInWithGoogle()}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={` ${dark ? "dark" : ""}   `}>
      <div className="">
        <Navbar verifiedUser={verifiedUser}/>
        <div className="w-full h-full">
        <Notes/>
        </div>
      </div>
    </div>
  );
}

export default App;