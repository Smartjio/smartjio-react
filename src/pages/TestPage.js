import React from 'react'
// import SideBar from '../components/SideBar';
import { db } from "../firebase.js";
import { collection, getDoc, doc } from "firebase/firestore";

export default function TestPage() {
    const getFriendArray = async (user_id) => {
        const userDoc = doc(collection(db, "users"), user_id);
        const myUserDoc = await getDoc(userDoc);
        if (myUserDoc.exists()) {
            console.log("friend Array = ", myUserDoc.data().friends)
            if (myUserDoc.data().friends === undefined) {
                console.log("undefined is success!");
                return [];
            } else {
                return myUserDoc.data().friends;
                // returns an array. 
            }
        } else {
            console.log("Error");
        }
    };

    function SeeMyArray() {
        return (
            // getFriendArray("sQBvVfg44ySnIpipCNhQsqS4XG33")
            getFriendArray("2IDRlQwYOpWqSDoM6v2glre2WAk2")
        )
    }

  return (
    <div>
        this is the testpage
            {getFriendArray("2IDRlQwYOpWqSDoM6v2glre2WAk2").length === 0 ?
            <text> really empty array </text> : 
            <text> where got </text>
            }
    </div>
  )
}
