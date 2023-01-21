import React, { useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../services/firebase";
import { db } from "../services/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
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
import { async } from "@firebase/util";
import Navbar from "./Navbar";
function Notes(props) {
  auth.languageCode = "it";
  const provider = new GoogleAuthProvider();
  // const [verifiedUser, setVerifiedUser] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [verifiedUser, setVerifiedUser] = useState(storedUser);
  const store = JSON.parse(localStorage.getItem("Todo"));
  const [show, setShow] = useState(false);
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
  const darkMode = () => {
    setDark((prev) => !prev);
  };

  const colors = ["#f59475", "#f9c975", "#b388f9", "#12e8fb", "#e4f693", "#17e2f4"];

  // const getAllNotes = async (e) => {
  //   try {
  //     const arr = [];
  //     const querySnapshot = await getDocs(
  //       collection(db, "notes", currentUser, "user")
  //     );
  //     querySnapshot.forEach((doc) => {
  //       arr.push(doc.data());
  //     });
  //     setNotes(arr);
  //     return arr;
  //   } catch (error) {
  //     console.log("error on get all notes", error);
  //   }
  // };

  // const fetchReviews = async () => {
  //   getAllNotes(props.verifiedUser.displayName);
  // };

  // useEffect(() => {
  //   fetchReviews();
  // }, [])

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
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    setDetails(data);
  };

  // const handleDelete = async (val) => {
  //   await deleteDoc(doc(db, "notes", val.id))
  // };

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
    <>
      <Modal
        show={show}
        onChange={handleChange}
        onClose={closeToggle}
        currentUser={currentUser}
      />
      <div className="hidden h-full md:flex">
        <div className="">
          <div className="w-32  h-full border-r-2 border-[#f9f9f9d6] bg-purple-200 sticky top-0  ">
            <div className="h-[50%]  pt-5">
              <button
                className=" p-4 mx-auto flex mb-6 font-semibold text-center shadow-md  top-20 rounded-3xl bg-[#1D1D1D] "
                onClick={() => setShow(!show)}
              >
                <span>
                  <FiPlus className="text-white font-[30px]" />
                </span>
              </button>
            </div>
            <div className="h-[50%]  flex flex-col justify-end items-center text-left pb-5">
              <span className="mr-2 rounded-full ">
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
              <span className="mt-1 font-semibold text-white">
                {/* {props.verifiedUser ? `${username}'s Fun Notes` : "Fun Notes"} */}
                {username}
              </span>
              <button
                onClick={handleSignOut}
                className="font-normal text-[17px] text-white cursor-pointer flex items-center gap-1"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="grid items-center justify-center w-full grid-cols-5 pt-16 mx-auto">
          {details &&
            details
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((val, id) => {
                const date = new Date(
                  val.createdAt.seconds * 1000
                ).toLocaleDateString("default", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <div
                    key={id}
                    className="bg-green-400 border-2 border-black w-52 h-52"
                  >
                    <p className="pt-2 ">{val.e}</p>
                    <p className="pt-2 ">{val.id}</p>
                    <button
                      className="p-1 rounded-md "
                      onClick={() => handleDelete(val)}
                    >
                      <MdDelete className="" />
                      {date}
                    </button>
                  </div>
                );
              })}
        </div>
      </div>

      {/* MOBILE */}

      <div className="flex flex-col h-full md:hidden">
        <Navbar verifiedUser={verifiedUser} />
        <div className="px-10 pt-20">
            <p className="text-3xl font-bold">{details.length > 0 ? "Notes" : ""}</p>
        </div>
        <div className={` gap-2 px-10 pt-5 ${details.length > 0 ? "grid grid-cols-2" : "flex justify-center"}`}>

          {/* Number of notes: {details.length} */}
          {details.length > 0 ? (
            details &&
            details
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((val, id) => {
                const date = new Date(
                  val.createdAt.seconds * 1000
                ).toLocaleDateString("default", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
                return (
                  <div
                    key={id}
                    className="w-40 h-40 p-2 rounded-md shadow-lg"
                    style={{ backgroundColor: colors[id % colors.length] }}
                  >
                    <div>
                      <p className="pt-2 text-[14px] font-normal ">{val.e}</p>
                    </div>
                    <div className="flex items-end justify-between mt-[6.3rem]">
                      <p className="text-[12px] font-medium"> {date}</p>
                        <button
                          className=""
                          onClick={() => handleDelete(val)}
                        >
                          <MdDelete className="" />
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
              className="fixed p-4 flex mb-6 font-semibold text-center shadow-md  bottom-9 rounded-3xl bg-[#1D1D1D] right-3 "
              onClick={() => setShow(!show)}
            >
              <span>
                <FiPlus className="text-white font-[30px]" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Notes;
