import React, { useState, useEffect } from "react";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Navbar(props) {
  const navigate = useNavigate();
  let username =
    props.verifiedUser && props.verifiedUser.displayName.split(" ")[0];
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("user");
        navigate("/");
        window.location.reload();
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <header className="flex  items-center h-16 bg-[#1D1D1D] fixed left-0 right-0 z-10">
      <nav className="relative flex items-center justify-between w-full px-8">
        <div className="flex items-center justify-between ">
          <span className="mr-2 rounded-full w-7 h-7">
            {props.verifiedUser ? (
              <img
                alt=""
                className="object-contain w-full h-full rounded-full"
                src={props.verifiedUser.photoURL}
              />
            ) : (
              <span className="w-full h-full rounded-full bg-slate-400"></span>
            )}
          </span>
          <span className="text-white ">
            {props.verifiedUser ? `${username}'s Fun Notes` : "Fun Notes"}
          </span>
        </div>
        <div className="">
          <button
            onClick={handleSignOut}
            className="font-normal text-[14px] text-white cursor-pointer flex items-center gap-1"
          >
            <FiLogOut className="font-normal" />
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
export default Navbar;
