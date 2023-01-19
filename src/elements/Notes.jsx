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

  const getAllNotes = async (e) => {
    try {
      const arr = [];
      const querySnapshot = await getDocs(
        collection(db, "notes", currentUser, "user")
      );
      querySnapshot.forEach((doc) => {
        arr.push(doc.data());
      });
      // const average = sum / arr.length;
      // console.log(arr,"getAllReviews");
      setNotes(arr);
      return arr;
    } catch (error) {
      //   toast("The reviews for this product failed to fetch, please try again later.", { ...config, type: "error" });
      console.log("error on get all notes", error);
    }
  };
  console.log(notes, "yes");

  const fetchReviews = async () => {
    getAllNotes(props.verifiedUser.displayName);
    // console.log(getAllNotes, "getAllNotes");
  };
  useEffect(() => {
    fetchReviews();
  }, []);

  // const dateCreater =  () => {
  //   notes.sort((a, b) => b.createdAt - a.createdAt)
  //   .map((notes, index) => {
  //     const date = new Date(notes.createdAt.seconds * 1000).toLocaleDateString();
  //     console.log(date, "date");
  // })}

  // console.log(dateCreater, "dateCreater");

  const handleDelete = async () => {
    try {
      const noteDocRef = doc(db, "notes", "06WmGuovcRpZoGzFfs1k");
      await deleteDoc(noteDocRef);
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  const [showFullText, setShowFullText] = useState(-1);

  const handleReadMore = (index) => {
    setShowFullText(index);
  };
  console.log('index', showFullText);

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
      <div className="hidden h-screen md:flex">
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
        <div
          className="mt-12   w-full"
        >


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
                  <div className="mt-5  ">
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
                                <button onClick={() => handleReadMore(index)}>
                                  Read More
                                </button>
                              </div>
                            </div>
                          )}
                              <h1> {date}</h1>
                          </div>

                  </div>
                );
              })}
        </div>
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
          {notes.length}
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
          )}
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
