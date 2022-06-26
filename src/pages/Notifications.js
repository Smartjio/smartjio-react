import { React, useState, useEffect } from "react";
import {
  collection,
  getDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Box, Center, Heading, VStack, Image } from "@chakra-ui/react";

import NavBar from "../components/NavBar";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import AvatarRipple from "../components/AvatarRipple";

export default function Notifications() {
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  console.log(currentUser);
  // const [sender, setSender] = useState("");
  // const [eventId, setEventId] = useState(""); <ListIcon as={MdCheckCircle} color='green.500' />
  const [myNotifications, setMyNotifications] = useState([]);
  const [allDetails, setAllDetails] = useState([]);
  const [finalDetails, setFinalDetails] = useState([]);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const myQuery = query(
          collection(db, "notification"),
          where("recipient", "==", currentUser.uid)
        ); // till i deal with this currentUser.uid
        const queryResults = await getDocs(myQuery);
        // console.log("firebase is a dissapointment", queryResults);
        // setMyNotifications(queryResults);
        // console.log("inside of try my []", myNotifications);
        /* queryResults.forEach((doc) => {
                    console.log(doc); // not running
                    setMyNotifications(myNotifications.push(doc)); 
                }); */
        setMyNotifications(
          queryResults.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        ); // this works
        // myNotifications.map
      } catch (error) {
        console.log(error);
      }
    };
    getNotifications();
    console.log("see all my notifications = ", myNotifications);
  }, [currentUser]); // why is currentUser in the dependency list?

  function resolvePromise (elem) {
    return (
        elem.then(value => {
            console.log("whats within my promise = ", value); // 👉️ "hello"
            // setFinalDetails(finalDetails => finalDetails.push(value)); // why does it end up being = 2?
            setFinalDetails([...finalDetails, value]); // how does this keep replacing.
            return(value);
          }).catch(err => {
            console.log(err);
            // return ("failed");
          })
    );
  }

  useEffect(() => {
    // look through
    const getDetails = async (elem) => {
        // why is my try not enough to unpack the promise object?
        const userDoc = doc(collection(db, "users"), elem.sender);
        const eventDoc = doc(collection(db, "events"), elem.event_id);
        const myUserDoc = await getDoc(userDoc);
        const myEventDoc = await getDoc(eventDoc);
        if (myUserDoc.exists() && myEventDoc.exists()) {
            return {
                sender_name: myUserDoc.data().username,
                sender_image: myUserDoc.data().img,
                sender_level: myUserDoc.data().level,
                event_activity: myEventDoc.data().activity,
                event_venue: myEventDoc.data().court_id,
                event_time: myEventDoc.data().time,
                event_organiser: myEventDoc.data().organiser,
                sender: elem.sender,
                event_id: elem.event_id,
              };
        } else {
            console.log("Error");
        }

    };

    // super important piece of code: .map(resolvePromise) -> runs the thing to fill up final details. 

    // myNotifications.map((notify) => getDetails(notify)); // why does this return a promise?
    // setAllDetails(myNotifications.map((notify) => getDetails(notify)).forEach()); 
    const temp = [];
    myNotifications.forEach(val => {
        console.log("in my loop = ", val);
        const tempVar = resolvePromise(getDetails(val));
        temp.push(tempVar);
    }); // Fuck javascript and their empty promises
    console.log("my temp = ", temp);
    setAllDetails(temp); 
    /* .map((notify) => notify.then(value => {return(value);}).catch(err => {console.log(err);})
    ));  */// i get an array of promise object?
  }, [myNotifications]);

  // console.log("second query = ", allDetails);
  console.log("final detail query = ", finalDetails); // not adding to the [] but replacing.
  //  setAllDetails(allDetails.map(resolvePromise));

  return (
    <div>
      <NavBar />
      <Center>
        <Heading>Notifications</Heading>
      </Center>

      <VStack>
        {myNotifications.map((notify, index) => {
          return (
            <Box
              bg="silver"
              w="50%"
              p={4}
              color="black"
              align="center"
              key={index}
            >
              <h1>Sender img: {notify.sender}</h1>
              <h1>event UID: {notify.event_id}</h1>
            </Box>
          );
        })}
        {finalDetails.map((notify) => {
            console.log("a single notification be like = ",notify);
          return (
            <Box
              bg="silver"
              w="50%"
              p={4}
              color="black"
              align="center"
              // key={index}
            >
              <h1>Sender username: {notify["sender_name"]}</h1>
              <h1>Sender IMG:</h1> 
              <Image src={notify.sender_image} />
              <h1>Sender lvl: {notify.sender_level}</h1>
              <h1>what activity: {notify.event_activity}</h1>
              <h1>Event Venue: {notify.event_venue}</h1>
              {/* <h1>Event Organiser: {notify.event_organiser}</h1> */}
            </Box>
            // <AvatarRipple display_picture={notify.sender_image} user_name={notify.sender_name} player_level={notify.sender_level}/>
          );
        })}
      </VStack>
    </div>
  );
}
