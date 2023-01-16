
import React, { useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../services/firebase";
import { db } from "../services/firebase";
import {collection, addDoc, getDocs, doc, setDoc, serverTimestamp , deleteDoc} from 'firebase/firestore';
import Modal from "../Modal/Modal";
import { async } from "@firebase/util";
 function Notes(props) {
    auth.languageCode = "it";
    const provider = new GoogleAuthProvider();
    const [verifiedUser, setVerifiedUser] = useState(null);
    const store = JSON.parse(localStorage.getItem("Todo"));
    const [show, setShow] = useState(false);
    const [dark, setDark] = useState(false);
    const currentUser =  props.verifiedUser.email
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
        const collectionsRef = collection(db, 'notes', currentUser, 'user');
        await addDoc(collectionsRef, {
            e,
            createdAt: serverTimestamp(),
          });
          window.location.reload()
        setShow(!show);
      };
      const closeToggle = () => setShow(!show);
      const darkMode = () => {
        setDark((prev) => !prev);
      };

     const getAllNotes =  async (e) => {
        try {
            const arr = [];
           const querySnapshot = await getDocs(collection(db, 'notes', currentUser, 'user'));
            querySnapshot.forEach((doc) => {
              arr.push(doc.data());
            });
            // const average = sum / arr.length;
            // console.log(arr,"getAllReviews");
            setNotes(arr)
            return arr;
          } catch (error) {
        //   toast("The reviews for this product failed to fetch, please try again later.", { ...config, type: "error" });
          console.log("error on get all notes", error);
        }
      }
      console.log(notes,"yes");

 const fetchReviews = async () => {
    getAllNotes(props.verifiedUser.displayName);
    // console.log(getAllNotes, "getAllNotes");
  };
  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    try {
        const noteDocRef = doc(db, 'notes', id)
        await deleteDoc(noteDocRef)
        console.log("Document successfully deleted!");
    } catch (error) {
        console.error("Error removing document: ", error);
    }
};

  return (
    <>
        <Modal show={show} onChange={handleChange} onClose={closeToggle} currentUser={currentUser}  />
    <div className="md:flex hidden h-screen">
        <div className="">
            <div className="w-32  h-screen border-r-2 border-[#f9f9f9d6]">

            <button
            // className="fixed p-4 flex mb-6 font-semibold text-center shadow-md  bottom-9 rounded-3xl bg-green-300 right-3 "
            className="relative p-4 mx-auto flex mb-6 font-semibold text-center shadow-md  top-20 rounded-3xl bg-[#1D1D1D] "
            onClick={() => setShow(!show)}
            >
            <span>
            <FiEdit2 className="text-white" />
            </span>
            </button>
            </div>

        </div>
    <div
    className={`flex w-full  m-auto mt-10 flex-col flex-wrap p-6  relative ${
      show ? " " : ""
    }`}

    >
      {notes.length}
    {notes.length > 0 ? (
      notes.map((note, i) => {
        return (
          <div
            className="items flex justify-evenly p-4 border-slate-300 border w-fit rounded-md mt-2 shadow-md dark:shadow-sm dark:shadow-white"
            key={i}
          >
            <div className="w-11/12 mr-4 text-black leading-6">
            {note.e}
            </div>
            <button
              className=" p-1 rounded-md"
             onClick={()=> {
               handleDelete()
             } 
       }
            >
              <MdDelete className="" />
            </button>
          </div>
        );
      })
    ) 
    : (

      <div className="text-white  flex flex-col mt-96 justify-center items-center">
        <div className="flex justify-center items-center flex-col m-auto h-full">
          <div>
          </div>
          <div>
            <h1 className=" font-bold text-xl text-black">
              Add a note to your journal
            </h1>
          </div>
        </div>
      </div>
    )}
  </div>
    </div>
    <div className="flex flex-col md:hidden h-full">
    <div
    className={`flexl  m-auto mt-10 flex-col flex-wrap p-6  relative ${
      show ? " " : ""
    }`}
  >
    {listItems.length > 0 ? (
      listItems.map((val, i) => {
        return (
          <div
            className="items flex justify-evenly p-4 border-slate-300 border w-fit rounded-md mt-2 shadow-md dark:shadow-sm dark:shadow-white"
            key={i}
          >
            <div className="w-11/12 mr-4 text-black leading-6">
              {val}
            </div>
            <button
              className=" p-1 rounded-md"
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
      // <p>Add a note to display here</p>
      <div className="text-white  flex flex-col  justify-center items-center">
        <div className="flex justify-center items-center flex-col m-auto h-full">
          <div>
            {/* <img src={TravellingMan} alt="Travelling man" /> */}
          </div>
          <div>
            <h1 className=" font-bold text-xl text-black">
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
            <FiEdit2 className="text-white" />
            </span>
            </button>
            </div>
        </div>
    </div>
    </>
  )
}
export default Notes;