import { React, useState, useEffect, useCallback } from "react";
import {
  collection,
  getDoc,
  // updateDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Box, Center, Heading, VStack, Image, Tabs, TabList, TabPanels, Tab, TabPanel, Flex, Text, Spacer, Button, ButtonGroup } from "@chakra-ui/react";

import NavBar from "../components/NavBar";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import AvatarRipple from "../components/AvatarRipple";

const testImg =
  "data:image/png;base64,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";

export default function Notifications() {
  const { currentUser } = useAuth();
  const myId = currentUser.uid;
  const [myNotifications, setMyNotifications] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const getNotifications = async () => {
      const tempArray = [];
      try {
        const myQuery = query(
          collection(db, "notification"),
          where("recipient", "==", myId)
        );
        const queryResults = await getDocs(myQuery);
        queryResults.forEach((doc) => {
          // console.log("inside the query loop", doc.data()); // ran 2x instead of 1x
          tempArray.push(doc.data());
          // setMyNotifications([...myNotifications, doc.data()]);
        });
        const newArray = tempArray.map(
          (elem) => queryWithinLoop(elem) // function returns a promise
        ); //.map(elem => elem.then(value => { return value }).catch(err => { console.log(err) }));
        // deal with promises
        const promiseSolver = Promise.all(newArray).then((values) => {
          return values;
        });
        const anotherArray = await promiseSolver;
        // console.log("settle the kettle = ", anotherArray); GREAT SUCCCESS
        setMyNotifications(anotherArray);
      } catch (error) {
        console.log(error);
      }
    };
    getNotifications();
    console.log("inside of my []", myNotifications);
  }, []); // just disable the warning. 

  const queryWithinLoop = async (elem) => {
    // maybe this shouldnt be an async function since it resides within another async function => resulting in a promise return
    const userDoc = doc(collection(db, "users"), elem.sender);
    const eventDoc = doc(collection(db, "events"), elem.event_id);
    const myUserDoc = await getDoc(userDoc);
    const myEventDoc = await getDoc(eventDoc);
    if (myUserDoc.exists() && myEventDoc.exists()) {
      const temp = {
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
      // console.log("deepest loop = ", temp)
      return temp;
    } else {
      console.log("Error");
    }
  };

  function InvitationsTab() {
    return(
        myNotifications.map((notify) => {
            // (notify, index) in the event that the keys of each need to be distinct. 
            return (
              <Box
                bg="silver"
                w="80%"
                p={4}
                color="black"
                align="center"
                borderWidth="1px"
                borderRadius="lg"
                key={notify.event_id}
              >
                <Flex minWidth='min-content' alignItems='center' gap='2'>
                <Box p='2'>
                <Image
                    borderRadius='full'
                    boxSize='150px'
                    src={notify.sender_image}
                    alt={notify.sender_name}
                    fallbackSrc='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKaiKiPcLJj7ufrj6M2KaPwyCT4lDSFA5oog&usqp=CAU'
                    />
                </Box>
                <Box p='2'>
                    <Text fontSize='md'>
                    {notify["sender_name"]} send you a game invite of {notify.event_activity} at {notify.event_venue} 
                    </Text>
                </Box>
                <Spacer />
                <ButtonGroup gap='2'>
                    <Button colorScheme='teal'>Accept</Button>
                    <Button colorScheme='teal'>Decline</Button>
                </ButtonGroup>
                </Flex>
                {/* <h1>Sender username: {notify["sender_name"]}</h1>
                <h1>Sender IMG:</h1>
                <Image src={notify.sender_image} />
                <h1>Sender lvl: {notify.sender_level}</h1>
                <h1>what activity: {notify.event_activity}</h1>
                <h1>Event Venue: {notify.event_venue}</h1>
                <h1>Event Organiser: {notify.event_organiser}</h1> */}
              </Box>
            );
          })
    );
  }

  useEffect(() => {
    const getFriendRequests = async () => {
        const tempArray = [];
        try {      
            const myQuery = query(
                collection(db, "friendRequest"),
                where("request_to", "==", myId)
              );
              const queryResults = await getDocs(myQuery);
              queryResults.forEach((doc) => {
                tempArray.push(doc.data());
              });
              // console.log("temp array is..., ", tempArray);
              setFriendRequests(tempArray);
        } catch (error) {
            console.log(error);
        }
    };
    getFriendRequests();
    console.log("friend requests", friendRequests);
    }, []);

    function BefriendTab() {
        return (friendRequests.length === 0 ? 
            <Heading> 
                You currently have no friend requests
            </Heading> 
            :
            friendRequests.map((req) => {
                return (req.friends_already ?
                    <Heading>
                        make this into saying you and so and so are friends!
                    </Heading> 
                    :
                    <Heading>
                        make this into a friend req PrivateOutlet
                    </Heading>
                );
            })
            );
            // make this clickable so that you go to the user profile page. 
    }

    // i have four buttons and functions to make -> accept invite, decline invite, accept friend and reject friend -> handleOnClick four times!!


  return (
    <div>
      <NavBar />
      <Center>
        <Heading>My Notifications</Heading>
      </Center>

      <Tabs isFitted variant="enclosed" variant='soft-rounded' colorScheme='green'>
        <TabList mb="1em">
          <Tab>Event Invitations</Tab>
          <Tab>Friend Requests</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
          <VStack>
        <InvitationsTab />
        <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
          <AvatarRipple
            display_picture=""
            user_name="{props.sender_name}"
            player_level="{props.sender_level}"
          />
        </Box>
      </VStack>
          </TabPanel>
          <TabPanel>
            <BefriendTab />
          </TabPanel>
        </TabPanels>
      </Tabs>

    </div>
  );
}


/*         {myNotifications.map((notify, index) => {
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
        })} */