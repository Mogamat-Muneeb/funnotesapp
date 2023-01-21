import React, { useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../services/firebase";
import { db } from "../services/firebase";

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
function Notes(props) {
  auth.languageCode = "it";
  const provider = new GoogleAuthProvider();
  const [verifiedUser, setVerifiedUser] = useState(null);
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
        await deleteDoc(doc(db, "notes", currentUser, "user", val.id))
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
      <div className="hidden h-screen pt-20 md:flex">
        <div className="">
          <div className="w-32  h-screen border-r-2 border-[#f9f9f9d6] bg-green-400">
            <button
              // className="fixed flex p-4 mb-6 font-semibold text-center bg-green-300 shadow-md bottom-9 rounded-3xl right-3 "
              className="relative p-4 mx-auto flex mb-6 font-semibold text-center shadow-md  top-20 rounded-3xl bg-[#1D1D1D] "
              onClick={() => setShow(!show)}
            >
              <span>
                <FiPlus className="text-white font-[30px]" />
              </span>
            </button>
          </div>
        </div>
        <div>
          {details.map((val, id) => {
            console.log(val, "val");
            return (
              <div key={id} className="border-2 border-black">
                {/* <p  className="pt-2 ">{val.e}</p> */}
                <p className="pt-2 ">{val.id}</p>
                <button
                  className="p-1 rounded-md "
                  onClick={() => handleDelete(val)}
                >
                  {/* <MdDelete className="" /> */}d
                </button>
              </div>
            );
          })}
        </div>
        {/* <div className="w-full mt-12">
          {notes &&
            notes
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((note, index) => {
                const date = new Date(
                  note.createdAt.seconds * 1000
                ).toLocaleDateString("default", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <div className="mt-5 " key={index}>
                    <div className="w-[250px] h-[250px] bg-blue-200 rounded-lg">
                      {showFullText === index ? (
                        <div>
                          {note.e}
                          <div className="flex items-start pt-2">
                            <button onClick={() => handleReadLess()}>
                              Read Less
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {note.e.slice(0, 60)}
                          <div className="flex items-start pt-2">
                            <button onClick={() => handleReadMore(note)}>
                              Read More
                            </button>
                          </div>
                        </div>
                      )}

                      <h1> {date}</h1>
                      <button
                        className="p-1 rounded-md "
                        onClick={() => handleDelete(note)}
                      >
                        <MdDelete className="" />
                      </button>
                    </div>
                  </div>
                );
              })}
        </div> */}
      </div>

      {/* MOBILE */}

      <div className="flex flex-col h-full md:hidden">
        <div
          className={`flexl  m-auto mt-10 flex-col flex-wrap p-6  relative ${
            show ? " " : ""
          }`}
        >
          {/* {listItems.length > 0 ? (
      listItems.map((val, i) => {
        return (
          <div
            className="flex p-4 mt-2 border rounded-md shadow-md items justify-evenly border-slate-300 w-fit dark:shadow-sm dark:shadow-white"
            key={i}
          >
            <div className="w-11/12 mr-4 leading-6 text-black">
              {val}
            </div>
            <button
              className="p-1 rounded-md "
              onClick={() => {
                setListItems(listItems.filter((val, id) => i !== id));
              }}
            >
              <MdDelete className="" />
            </button>
          </div>
        );
      })
    ) : (
      <div className="flex flex-col items-center justify-center text-white">
        <div className="flex flex-col items-center justify-center h-full m-auto">
          <div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-black ">
              Add a note to your journal
            </h1>
          </div>
        </div>
      </div>
    )} */}
          {/* {notes.length}
          {notes.length > 0 ? (
            notes.map((note, i) => {
              return (
                <div
                  className="flex p-4 mt-2 border rounded-md shadow-md items justify-evenly border-slate-300 w-fit dark:shadow-sm dark:shadow-white"
                  key={i}
                >
                  <div className="w-11/12 mr-4 leading-6 text-black">
                    {note.e}
                  </div>
                  <button
                    className="p-1 rounded-md "
                    onClick={() => {
                      handleDelete();
                    }}
                  >
                    <MdDelete className="" />
                  </button>
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
          )} */}
            <div>
           Number of notes:   {details.length}
              {details.map((val, id) => {
                // console.log(val, "val");/
                return (
                  <div key={id} className="border-2 border-black">
                    {/* <p  className="pt-2 ">{val.e}</p> */}
                    <p className="pt-2 ">{val.id}</p>
                    <button
                      className="p-1 bg-red-500 rounded-md"
                      onClick={() => handleDelete(val)}
                    >
                    Delete
                    </button>
                  </div>
                )})}
        </div>
        </div>
        <div className="">
          <div className="  h-screen border-r-2 border-[#f9f9f9d6]">
            <button
              className="fixed p-4 flex mb-6 font-semibold text-center shadow-md  bottom-9 rounded-3xl bg-[#1D1D1D] right-3 "
              // className="relative p-4 mx-auto flex mb-6 font-semibold text-center shadow-md  top-20 rounded-3xl bg-[#1D1D1D] "
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
