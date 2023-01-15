import React, { useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../services/firebase";


function Navbar( props ){
    let username = props.verifiedUser && props.verifiedUser.displayName.split(" ")[0];
  console.log( props.verifiedUser , "got it?");
    return(
    <header className="flex  items-center h-16 bg-[#1D1D1D] fixed left-0 right-0 z-10">
          <nav className="flex p-6 justify-center w-full content-center relative">
            <div className="logo flex justify-between">
              <span className="w-8 h-8 mr-2 rounded-full">
                {props.verifiedUser ? (
                  <img
                    alt=""
                    className="rounded-full h-full w-full object-contain"
                    src={props.verifiedUser.photoURL}
                  />
                ) : (
                  <span className="rounded-full w-full h-full bg-slate-400"></span>
                )}
              </span>
              <span className="mt-1 font-semibold text-white">
                {props.verifiedUser ? `${username}'s Fun Notes` : "Fun Notes"}
              </span>
            </div>
            <div className="absolute ml-3 right-10">
              {/* <button onClick={darkMode} className="w-10 h-10">
                <img
                  className="object-cover h-full w-full"
                  src={dark ? ToggleOn : ToggleOff}
                  alt=""
                />
              </button> */}
            </div>
          </nav>
        </header>
    )
}
export default Navbar;