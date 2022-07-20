import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, addDoc, doc, deleteDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from '../firebase';

import {
    Button,
    Flex,
  } from "@chakra-ui/react";

import { AddIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";

export default function FriendButton(props) {
    const { userData, currentUser } = useAuth();
    // add friend, friend req sent, remove friend, (currently own profile aka no button)
    // function currentState() {
    //     if 
    // }
    function searchFriends(id) {
        return id === props.id;
    }

    const isFriend = userData.friends.find(id => searchFriends(id))
    const [ requested, setRequested ] = useState();
    const [ reqDocument, setReqDocument ] = useState();

    // console.log(userData)
    // console.log(isUser)
    // console.log(props.id)
    // console.log(currentUser.uid)
    // console.log(isFriend)

    useEffect(() => {
      const fetchRequested = async () => {
        try {
          const q = query(collection(db, "friendRequest"), where("request_from", "==", currentUser.uid), where("request_to", "==", props.id), where("friends_already", "==", false));
          const querySnapshot = await getDocs(q);
          console.log(querySnapshot);
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
          });

          if (!querySnapshot.empty) {
            // console.log("setting to true");
            setRequested(true);
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              setReqDocument(doc.id);
            });
          } else {
            // doc.data() will be undefined in this case
            setRequested(false);
            console.log("Error! No such document!");
          }
        } catch (error) {
          console.log(error);
        }
      }
      fetchRequested();
    }, [currentUser, props]);

    // console.log(requested);
    // console.log(reqDocument);

    const addFriend = async () => {
      const data = {
        friends_already: false,
        request_from: currentUser.uid,
        request_to: props.id
      };
      try {
          await addDoc(collection(db, "friendRequest"), data);
          window.location.reload();
      } catch (error) {
          console.log(error)
      }
    };

    const removeRequest = async () => {
      try {
        await deleteDoc(doc(db, "friendRequest", reqDocument));
          window.location.reload();
      } catch (error) {
          console.log(error)
      }
    };

    const removeFriend = async () => {
      try {
        await updateDoc(doc(db, "users", currentUser.uid), {
          friends: arrayRemove(props.id)
        });
          window.location.reload();
      } catch (error) {
          console.log(error)
      }
    };

  return (
    <Flex h={16} alignItems={"center"} justifyContent={"right"}>
        {(!isFriend && !requested) && <Button
            as="a"
            target="_blank"
            variant={"solid"}
            colorScheme={"cyan"}
            size={"sm"}
            mr={4}
            leftIcon={<AddIcon />}
            onClick={addFriend}
            >
            Add Friend
        </Button>}

        {(!isFriend && requested) && <Button
            as="a"
            target="_blank"
            variant={"solid"}
            colorScheme={"green"}
            size={"sm"}
            mr={4}
            leftIcon={<CheckIcon />}
            onClick={removeRequest}
            >
            Request Sent
        </Button>}

        {isFriend && <Button
            as="a"
            target="_blank"
            variant={"solid"}
            colorScheme={"red"}
            size={"sm"}
            mr={4}
            leftIcon={<CloseIcon />}
            onClick={removeFriend}
            >
            Remove Friend
        </Button>}

    </Flex>
  )
}
