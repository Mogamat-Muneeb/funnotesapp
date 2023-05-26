import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {BiArrowBack} from   "react-icons/bi";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
  deleteDoc,
  query,
  getDoc,
} from "firebase/firestore";
import { auth } from "../services/firebase";
import { db } from "../services/firebase";
import { async } from "@firebase/util";
import EditModal from "../Modal/EditModal";
import Navbar from "./Navbar";
const NoteDetail = () => {
  let { id } = useParams();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [verifiedUser, setVerifiedUser] = useState(storedUser);
  const currentUser = verifiedUser.email;
  const [details, setNote] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "notes", currentUser, "user", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setNote(data);
      } else {
        alert("No such document!");
      }
    };
    fetchData();
  }, [id, currentUser]);

  // console.log(details.e, "de");
  // const createdAt1 = details.createdAt.seconds * 1000
  // console.log(createdAt1, "yes man");
  // const date = new Date(
  //     createdAt1
  //   ).toLocaleDateString("default", {
  //     day: "numeric",
  //     month: "short",
  //     year: "numeric",
  //   });
  return (
    <>
    <div className="flex md:hidden ">
    <Navbar verifiedUser={verifiedUser} />
    <div className="flex gap-4 px-10 mt-24">
        <Link to="/">
        <BiArrowBack className="text-[25px]" />
        </Link>
        <div className="flex flex-col">
            {/* <p className="text-lg font-bold">Note Name : {name}</p> */}
            <p className="text-[16px]">{details.e}</p>
      {/* {date} */}
        </div>
    </div>
    </div>
    <div className="hidden gap-4 px-10 pt-10 md:flex">
    <Link to="/">
        <BiArrowBack className="text-[25px]" />
        </Link>
        <div className="flex flex-col">
            {/* <p className="text-lg font-bold">Note Name : {details.e.slice(0, 60)}</p> */}
            <p className="text-[16px]">{details.e}</p>
      {/* {date} */}
        </div>
        <EditModal/>
    </div>
    
    </>
  );
};

export default NoteDetail;
