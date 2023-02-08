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
import { VscChromeClose } from "react-icons/vsc";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
  deleteDoc,
  query,
  onSnapshot
} from "firebase/firestore";
import Modal from "../Modal/Modal";
// import EditModal from "../Modal/EditModal";
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


  const [id, setId] = useState(null)
  const closeToggle = () => setShow(!show);
  const closeToggleEdit = () => {
    setShowEdit(!showEdit);
  }
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
        window.location.reload();
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const [details, setDetails] = useState([]);
  
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
      setInputValue(e.target.value);
  }

  const userData = async () => {
    const q = query(collection(db, "notes", currentUser, "user"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setDetails(data);
  };





  const updateData = async (inputValue, id )=> {
    try {
          const docRef = doc(db, "notes", currentUser, "user",id)
          await  setDoc(docRef, {e: inputValue},  {merge: true});
      window.location.reload();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
    // const docRef = doc(db, "notes", currentUser, "user",id)
    // setDoc(docRef, {e: inputValue},  {merge: true});
  }

  const handleDelete = async (val) => {
    try {
      await deleteDoc(doc(db, "notes", currentUser, "user", val.id));
      window.location.reload();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  useEffect(() => {
    userData();
    updateData();
    handleDelete()
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
        handleSubmit={updateData}
        id={id}
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
        <div className="flex flex-col">
        <div className="px-8 pt-10 pb-10">
          <p className="text-3xl font-bold">
          {details.length > 0 ? "Notes" : "Notes"}
          </p>
          <p className="text-[12px] leading-3">

            You have{" "}
            {details.length > 1
              ? `${details.length} notes`
              : `${details.length} note`}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 px-8">
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
                    className="flex flex-col p-2 rounded-md shadow-lg w-52 h-52"
                    style={{ backgroundColor: colors[id % colors.length] }}
                  >
                    <div className="h-full ">
                      <p className="text-[14px]"> {val.e.slice(0, 170)}</p>
                      {/* <Link to={`/notes/${val.id}`} className="text-[12px] leading-3">Read More</Link> */}
                      {val.e.length > 170 && (
  <Link to={`/notes/${val.id}`} className="text-[12px] leading-3">Read More</Link>
)}
                    </div>
                    <div className="flex justify-between gap-4">
                      <p className="text-[12px] "> {date}</p>
                      <div className="flex gap-2">
                        <button className="" onClick={() => handleDelete(val)}>
                          <MdDelete className="text-[14px]" />
                        </button>
                        <button className="" onClick={() => {
                          setId(val.id)
                          setShowEdit(!showEdit)}
                          }>
                          <BiPencil  className="text-[14px]" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
        </div>
      </div>

      <div className="flex flex-col h-full md:hidden">
        <Navbar verifiedUser={verifiedUser} />
        <div className="px-8 pt-20">
          <p className="text-3xl font-bold">
            {details.length > 0 ? "Notes" : "Notes"}
          </p>
          <p className="text-[12px] leading-3 mt-2">

            You have{" "}
            {details.length > 1
              ? `${details.length } notes`
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
                      {/* <Link to={`/notes/${val.id}`} className="text-[12px]">Read More</Link> */}
                      {val.e.length > 170 && (
  <Link to={`/notes/${val.id}`} className="text-[12px] leading-3">Read More</Link>
)}
                    </div>
                    <div className="flex items-end justify-end gap-2 ">
                      {/* <p className="text-[12px] font-medium"> {date}</p> */}
                      <button className="" onClick={() => handleDelete(val)}>
                        <MdDelete />
                      </button>
                      <button className="" onClick={() => {
                        setId(val.id)
                        setShowEdit(!showEdit)}
                        }>
                        <BiPencil />
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


function EditModal({ showEdit, onClose, onChange, currentUser , handleSubmit, id }) {
  const [inputValue, setInputValue] = useState("");
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(inputValue, id);
    setInputValue("")
  }
  return (
    <div
      className={`flex  justify-center items-center h-screen w-screen fixed top-0 left-0 overflow-hidden  bg-black bg-opacity-60 transition-opacity duration-300 z-[100]
         ${
          showEdit ? "block" : "hidden"
      }`}
    >
      <div className="bg-white  h-[200px] md:max-h-[400px]  w-full md:w-[517px] rounded-sm mx-4 md:mx-0 ">
        <div className="flex items-center justify-between px-5 pt-2 ">
          <h2 className="font-bold text-[20px] text-[#1D1D1D]">Edit a  Note</h2>
          <button className="flex items-center justify-center p-2 rounded-full shadow-md text-white bg-[#1D1D1D]" onClick={onClose}><VscChromeClose className="text-white" /></button>
        </div>
        <form  onSubmit={handleFormSubmit}  className="">
            <div className="flex items-center justify-center gap-4 px-5 mt-12 ">
              <input
                type="text"
                name=""
                id=""
                placeholder="What's happening?"
                onChange={event => setInputValue(event.target.value)}
                value={inputValue}
                className='bg-gray-200 border rounded-sm w-full pl-2 h-[45px] text-black focus:outline-none'
              />

                <button
                type="submit"
                    className='bg-black text-white rounded h-[45px] w-[100px]  font-semibold'
                >
                  Update
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};