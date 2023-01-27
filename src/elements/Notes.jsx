import React, { useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../services/firebase";
import { db } from "../services/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { FiLogOut } from "react-icons/fi";
import { BiPencil } from "react-icons/bi";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
  deleteDoc,
  query,
} from "firebase/firestore";
import Modal from "../Modal/Modal";
import EditModal from "../Modal/EditModal";
import { async } from "@firebase/util";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
function Notes(props) {
  auth.languageCode = "it";
  const provider = new GoogleAuthProvider();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [verifiedUser, setVerifiedUser] = useState(storedUser);
  const store = JSON.parse(localStorage.getItem("Todo"));
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [dark, setDark] = useState(false);
  const currentUser = props.verifiedUser.email;
  const [notes, setNotes] = useState([]);
  const [listItems, setListItems] = useState(() => {
    if (store) {
      return store;
    } else {
      return;
    }
  });
  useEffect(() => {
    localStorage.setItem("Todo", JSON.stringify(listItems));
  }, [listItems]);

  const handleChange = async (e) => {
    setListItems([...notes, e]);
    const collectionsRef = collection(db, "notes", currentUser, "user");
    await addDoc(collectionsRef, {
      e,
      createdAt: serverTimestamp(),
    });
    window.location.reload();
    setShow(!show);
  };

  const closeToggle = () => setShow(!show);
  const closeToggleEdit = () => setShowEdit(!showEdit);
  console.log(closeToggleEdit);
  const darkMode = () => {
    setDark((prev) => !prev);
  };

  const colors = [
    "#f59475",
    "#f9c975",
    "#b388f9",
    "#12e8fb",
    "#e4f693",
    "#17e2f4",
  ];

  let username =
    props.verifiedUser && props.verifiedUser.displayName.split(" ")[0];

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("user");
        console.log("Signed Out");
        // navigate("/");
        window.location.reload();
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const [details, setDetails] = useState([]);

  const userData = async () => {
    const q = query(collection(db, "notes", currentUser, "user"));

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setDetails(data);
  };

  const updateData = async (id, inputValue )=> {
    console.log(inputValue ,  "the value of input");
    const docRef = doc(db, "notes", currentUser, "user", id)
    const payload = {e: inputValue}
    setDoc(docRef, payload);
  }

  const handleDelete = async (val) => {
    console.log(val.id);
    try {
      await deleteDoc(doc(db, "notes", currentUser, "user", val.id));
      window.location.reload();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  useEffect(() => {
    userData();
    console.log(details, "detailsof");
  }, []);

  const [showFullText, setShowFullText] = useState(-1);

  const handleReadMore = (index) => {
    setShowFullText(index);
  };

  const handleReadLess = () => {
    setShowFullText(-1);
  };

  return (
    <div className="w-screen h-screen">
      <Modal
        show={show}
        onChange={handleChange}
        onClose={closeToggle}
        currentUser={currentUser}
      />
      <EditModal
        onClose={closeToggleEdit}
        showEdit={showEdit}
        currentUser={currentUser}
        onChange={updateData}
      />
      <div className="hidden h-full md:flex">
        <div className="">
          <div className="w-28  h-full border-r-2 border-[#f9f9f9d6] shadow-md sticky top-0  ">
            <div className="h-[50%]  pt-10">
              <button
                className=" p-4 mx-auto flex mb-6 font-semibold text-center shadow-md  top-20 rounded-3xl bg-[#1D1D1D] "
                onClick={() => setShow(!show)}
              >
                <span>
                  <FiPlus className="text-white font-[30px] shadow-md" />
                </span>
              </button>
            </div>
            <div className="h-[50%]  flex flex-col justify-end items-center text-left  pb-10 gap-2">
              <span className="rounded-full ">
                {props.verifiedUser ? (
                  <img
                    alt=""
                    className="object-contain w-[40px] h-[40px] rounded-full"
                    src={props.verifiedUser.photoURL}
                  />
                ) : (
                  <span className="w-full h-full rounded-full bg-slate-400"></span>
                )}
              </span>
              <button
                onClick={handleSignOut}
                className="font-medium text-[16px] text-black cursor-pointer flex items-center gap-1"
              >
                <FiLogOut className="font-normal" />
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-6 px-4 pt-10 gap-9">
          {details &&
            details
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((val, id) => {
                // const date = new Date(
                //   val.createdAt.seconds * 1000
                // ).toLocaleDateString("default", {
                //   day: "numeric",
                //   month: "short",
                //   year: "numeric",
                // });

                return (
                  <div
                    key={id}
                    className="flex flex-col p-2 rounded-md shadow-lg w-52 h-52"
                    style={{ backgroundColor: colors[id % colors.length] }}
                  >
                    <div className="h-full ">
                      <p className="text-[14px]"> {val.e.slice(0, 30)}</p>
                      <Link to={`/notes/${val.id}`}>Read More</Link>
                    </div>
                    <div className="flex items-end justify-between hull">
                      {/* <p className="text-[12px] font-medium"> {date}</p> */}
                      <button className="" onClick={() => handleDelete(val)}>
                        <MdDelete className="" />
                      </button>
                      <button className="" >
                        <BiPencil className="" />
                      </button>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>

      <div className="flex flex-col h-full md:hidden">
        <Navbar verifiedUser={verifiedUser} />
        <div className="px-8 pt-20">
          <p className="text-3xl font-bold">
            {details.length > 0 ? "Notes" : ""}
          </p>
          <p className="text-[12px] leading-3">
            {" "}
            You have{" "}
            {details.length > 1
              ? `${details.length} notes`
              : `${details.length} note`}
          </p>
        </div>
        <div
          className={` gap-2 px-8 pt-5 ${
            details.length > 0 ? "grid grid-cols-2 gap-2" : "flex justify-center"
          }`}
        >
          {details.length > 0 ? (
            details &&
            details
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((val, id) => {
                // const date = new Date(
                //   val.createdAt.seconds * 1000
                // ).toLocaleDateString("default", {
                //   day: "numeric",
                //   month: "short",
                //   year: "numeric",
                // });
                return (
                  <div
                    key={id}
                    className="flex flex-col h-40 p-2 rounded-md shadow-lg w-[10rem]"
                    style={{ backgroundColor: colors[id % colors.length] }}
                  >
                    <div className="h-full ">
                      <p className="text-[14px]"> {val.e.slice(0, 30)}</p>
                      <Link to={`/notes/${val.id}`}>Read More</Link>
                    </div>
                    <div className="flex items-end justify-between hull">
                      {/* <p className="text-[12px] font-medium"> {date}</p> */}
                      <button className="" onClick={() => handleDelete(val)}>
                        <MdDelete className="" />
                      </button>
                      {/* <button className="" onClick={() => {updateData(val.id)}} >
                        <BiPencil className="" />
                      </button> */}
                      <button className="" onClick={() => setShowEdit(!showEdit)}>
                        <BiPencil className="" />
                      </button>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="flex flex-col items-center justify-center text-white mt-96">
              <div className="flex flex-col items-center justify-center h-full m-auto">
                <div>
                  <h1 className="text-xl font-bold text-black ">
                    Add a note to your journal
                  </h1>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="">
          <div className="  h-full border-r-2 border-[#f9f9f9d6]">
            <button
              className="fixed p-4 flex mb-6 font-semibold text-center shadow-md  bottom-9 rounded-3xl bg-[#1D1D1D] right-6 "
              onClick={() => setShow(!show)}
            >
              <span>
                <FiPlus className="text-white font-[30px]" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Notes;
