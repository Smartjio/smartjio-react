import React from "react";

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  where,
  query,
} from "firebase/firestore";

import { db } from "../firebase.js";

export default function ChooseLocation() {
  return <div>ChooseLocation</div>;
}
