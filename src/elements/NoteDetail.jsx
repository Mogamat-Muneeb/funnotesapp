import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
const  NoteDetail =  () =>  {
    let { id } = useParams();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const [verifiedUser, setVerifiedUser] = useState(storedUser);
    const currentUser =verifiedUser.email;
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
        }
        fetchData()
    }, [id, currentUser])

    const createdAt = details.createdAt.seconds * 1000
    const date = new Date(
        createdAt
      ).toLocaleDateString("default", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });


    return (
      <div>
        <h1>Note Detail</h1>
        <p>Note ID: {id}</p>
        {details.e}
{date}
      </div>
    );
  }

  export default NoteDetail;