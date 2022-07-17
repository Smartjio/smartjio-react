import { React, useState, useEffect, /* useCallback */ } from "react";
import {
  collection,
  getDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { Box, Center, Heading, VStack, Image, Tabs, TabList, TabPanels, Tab, TabPanel, Flex, Text, Spacer, Button, ButtonGroup, Container, /* AspectRatio */ } from "@chakra-ui/react";

import NavBar from "../components/NavBar";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

export default function Notifications() {
  const { currentUser } = useAuth();
  // console.log(currentUser);
  const myId = currentUser.uid;
  const [myNotifications, setMyNotifications] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  console.log("notifications = ", myNotifications);
  console.log("friend requests = ", friendRequests);

  const navigate = useNavigate();

  const [triggerEffect, setTriggerEffect] = useState(false);

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
          const tempObject = doc.data()
          tempObject.docId = doc.id;
          // console.log("can access the document ID? = ", tempObject); // ran 2x instead of 1x
          tempArray.push(tempObject);
          // setMyNotifications([...myNotifications, doc.data()]);
        });
        const secondArray = tempArray.map(
          (elem) => queryWithinLoop(elem) // what if i pass the output of the function into another function??? 
        ); //.map(elem => elem.then(value => { return value }).catch(err => { console.log(err) }));
        // deal with promises
        const promiseSolver = Promise.all(secondArray).then((values) => {
          return values;
        });
        const thirdArray = await promiseSolver;
        // console.log("this is the third array = ", thirdArray);
        setMyNotifications(thirdArray);
        // now we get the court data without introducing more wrappings of promises 
        /* const fourthArray = thirdArray.map(
            (elem) => getCourtData(elem)
        );
        console.log("this is the fourth array = ", fourthArray);
        const resolvePromises = Promise.all(fourthArray).then((values) => {
            return values;
          });
        const fifthArray = await resolvePromises;
        console.log("settle the kettle = ", fifthArray); // GREAT SUCCCESS
        // not possible to wrap the getCourt(queryWithinLoop(elem)) => might be due to syntax? 
        setMyNotifications(fifthArray); */
      } catch (error) {
        console.log(error);
      }
    };
    getNotifications();
  }, [myId, triggerEffect]); // myId can be included so that the page will refresh?? 

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
        attendance: myEventDoc.data().attendees,
        docId: elem.docId,
        sender: elem.sender,
        event_id: elem.event_id,
      };
      // return temp;
      const courtDoc = doc(collection(db, "courts"), String(myEventDoc.data().court_id));
      const myCourtDoc = await getDoc(courtDoc);
      if (myCourtDoc.exists()) {
        temp["court_img"] = myCourtDoc.data().court_image
        temp["court_name"] = myCourtDoc.data().court_name
        temp["region"] = myCourtDoc.data().region
        // console.log("deepest loop = ", temp);
        return temp;
      } else {
        console.log("Error");
      }
    } else {
      console.log("Error");
    }
  };

  function InvitationsTab() {
    // buttons for handling events
    const updateAcceptEvent = async (event_id, participants, notificationId) => {
        const eventDoc = doc(db, "events", event_id);
        const tempArray = participants.concat([myId]); // participants should be an Array. 
        const newFields = { attendees: tempArray };
        await updateDoc(eventDoc, newFields); // cannot send invite to people who are already in the event -> event and jio page take note. 
        // for deleting the notification
        const notificationDoc = doc(db, "notification", notificationId);
        await deleteDoc(notificationDoc); 
        // window.location.reload(); // RSC-CHEAT
        setTriggerEffect(!triggerEffect);
    };

    const updateDeclineEvent = async (notificationId) => {
        const notificationDoc = doc(db, "notification", notificationId);
        await deleteDoc(notificationDoc);
        // window.location.reload(); // RSC-CHEAT
        setTriggerEffect(!triggerEffect);
    };

    /* const handleClickAccept = () => {
        need this when i figure out how to rerender notifications after the button has been clicked. 
    }; */

    return( myNotifications.length === 0 ? 
        <Heading> 
            You currently have no notifications
        </Heading> 
        :
        // will have error if it reads anything that might be undefined, regardless of whether the code reaches that portion or not.
        myNotifications.map((notify) => {
            // (notify, index) just use the doc id, since they are definitely unique.
            return ( notify === undefined ?
                <div></div> 
                :
              <Box
                bg="silver"
                w="80%"
                p={4}
                color="black"
                align="center"
                borderWidth="1px"
                borderRadius="lg"
                key={notify.id} // notify.event_id
              >
                <Flex minWidth='min-content' alignItems='center' gap='2'>
                <Container p='2' align="left">
                    <VStack>
                        <Image
                        borderRadius='full'
                        boxSize='150px'
                        src={notify.sender_image}
                        alt={notify.sender_name}
                        fallbackSrc='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKaiKiPcLJj7ufrj6M2KaPwyCT4lDSFA5oog&usqp=CAU'
                        onClick={async (event) => {
                            try {
                            await navigate("/");
                            } catch (error) {
                            console.log(error);
                            }
                        }}
                        />
                        <Text>{notify["sender_name"]}</Text>
                    </VStack>
                </Container>
                <Spacer />
                <Box p='2' 
                onClick={async (event) => {
                            try {
                            await navigate("/event/" + notify.event_id);
                            } catch (error) {
                            console.log(error);
                            }
                        }}
                        >
                    <Text fontSize='md'>
                    sent you a game invite of {notify.event_activity} at
                    </Text>
                </Box>
                <Spacer />
                <Container p='2' align="left">
                    <VStack>
                        <Image 
                            boxSize='160px'
                            borderRadius='lg'
                            src={notify.court_img}
                            alt={notify.court_name}
                            objectFit='cover'
                            fallbackSrc='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxzhiYqbWHirZnGuIc6_ZxdRjfABlGEpvqmw&usqp=CAU'
                            onClick={async (event) => {
                                try {
                                await navigate("/court/" + notify.event_venue);
                                } catch (error) {
                                console.log(error);
                                }
                            }}
                            />
                        <Text>{notify.court_name}  ({notify.region})</Text>
                    </VStack>
                </Container>

                <Spacer />

                <ButtonGroup gap='2'>
                    <Button colorScheme='teal' onClick={() => updateAcceptEvent(notify.event_id, notify.attendance, notify.docId)}>Accept</Button>
                    <Button colorScheme='teal' onClick={() => updateDeclineEvent(notify.docId)}>Decline</Button>
                </ButtonGroup>
                </Flex>
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
                // tempArray.push(doc.data());
                const tempObject = doc.data()
                tempObject.docId = doc.id; // adds docId attribute. 
                // console.log("can access the document ID? = ", tempObject); 
                tempArray.push(tempObject);
              });
              // console.log("temp array is..., ", tempArray);
              const newArray = tempArray.map(
                (elem) => getFriendData(elem) // function returns a promise
              );
              const promiseSolver = Promise.all(newArray).then((values) => {
                return values;
              });
              const anotherArray = await promiseSolver;
              // console.log("settle the kettle = ", anotherArray); //GREAT SUCCCESS
              setFriendRequests(anotherArray);
        } catch (error) {
            console.log(error);
        }
    };
    getFriendRequests();
    //console.log("friend requests", friendRequests);
    }, [myId, triggerEffect]);

    const getFriendData = async (elem) => {
        const userDoc = doc(collection(db, "users"), elem.request_from);
        const myUserDoc = await getDoc(userDoc);
        if (myUserDoc.exists()) {
        const temp = {
            sender_name: myUserDoc.data().username,
            sender_image: myUserDoc.data().img,
            sender_level: myUserDoc.data().level,
            docId: elem.docId,
            request_from: elem.request_from,
            friends_already: elem.friends_already,
        };
        // console.log("deepest loop = ", temp)
        return temp;
        } else {
        console.log("Error");
        }
    };

    // getFriendArray literally gets the array of friends so as to updateDoc it within the BeFriendTab. 
    const getFriendArray = async (user_id) => {
        const userDoc = doc(collection(db, "users"), user_id);
        const myUserDoc = await getDoc(userDoc);
        if (myUserDoc.exists()) {
            if (myUserDoc.data().friends === undefined) {
                console.log("friend Array = ", myUserDoc.data().friends); // works, but 
                return [];
            } else if (myUserDoc.data().friends.length === 1 && myUserDoc.data().friends[0] === "") {
                return [];
            } else {
                return myUserDoc.data().friends;
                // console.log("this are his / my friends ", myUserDoc.data().friends); 
                // returns an array. 
            }
        } else {
            console.log("Error");
        }
    };

    function BeFriendTab() {
        // this might be faulty -> relook at this section of notificaitons.
        // update document
        const updateAsFriends = async (friend_id, notificationId) => {
            const yourCurrentFriends = await getFriendArray(friend_id); // await should solve the promise issue
            const tempArray = yourCurrentFriends.concat([myId]);
            const userDoc = doc(db, "users", friend_id);
            const newFields = { friends: tempArray }; // will create field when there are no fields? probable bug. 
            const myCurrentFriends = await getFriendArray(myId);
            const myTempArray = myCurrentFriends.concat([friend_id]); // mine is opposite to that of my friend.
            const myDoc = doc(db, "users", myId);
            const myNewFields = { friends: myTempArray };
            await updateDoc(userDoc, newFields);
            await updateDoc(myDoc, myNewFields);
            // creates a new notification telling your new friend that you are now friends 
            await addDoc(collection(db, "friendRequest"), { friends_already: true, request_from: myId, request_to: friend_id });
            const notificationDoc = doc(db, "friendRequest", notificationId);
            await deleteDoc(notificationDoc);
            // window.location.reload(); // RSC-CHEAT
            setTriggerEffect(!triggerEffect); // rerenders the page
        };

        const declineFriendRequest = async (notificationId) => {
            // either get the document id or where(request_from and request_to are you and your friend respectively) 
            const notificationDoc = doc(db, "friendRequest", notificationId);
            await deleteDoc(notificationDoc);
            // window.location.reload(); // RSC-CHEAT
            setTriggerEffect(!triggerEffect);
        };

        return (friendRequests.length === 0 ? 
            <Heading> 
                You currently have no friend requests
            </Heading> 
            :
            friendRequests.map((req) => {
                return (req.friends_already ?
                    // no idea what req.id means.
                    // this is to show thatsomeone has accepted your friend request. 
                    <Box
                        bg="silver"
                        w="80%"
                        p={4}
                        color="black"
                        align="center"
                        borderWidth="1px"
                        borderRadius="lg"
                        key={req.id}
                    >
                        <Flex minWidth='min-content' alignItems='center' gap='2'>
                        <Box p='2'>
                        <Image
                            borderRadius='full'
                            boxSize='150px'
                            src={req.sender_image}
                            alt={req.sender_name}
                            fallbackSrc='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKaiKiPcLJj7ufrj6M2KaPwyCT4lDSFA5oog&usqp=CAU'
                            onClick={async (event) => {
                                try {
                                await navigate("/");
                                } catch (error) {
                                console.log(error);
                                }
                                // make this into a friend req PrivateOutlet
                            }}
                            />
                        </Box>
                        <Box p='2'>
                            <Text fontSize='md'>
                                Congratulations you are now friends with {req.sender_name}
                            </Text>
                        </Box>
                        <Spacer />
                        <ButtonGroup gap='2'>
                            <Button bg='maroon' color='white' onClick={() => declineFriendRequest(req.docId)}>Acknowledge</Button>
                        </ButtonGroup>
                        </Flex>
                    </Box>
                    :
                    <Box
                        bg="silver"
                        w="80%"
                        p={4}
                        color="black"
                        align="center"
                        borderWidth="1px"
                        borderRadius="lg"
                        key={req.id}
                    >
                        <Flex minWidth='min-content' alignItems='center' gap='2'>
                        <Box p='2'>
                        <Image
                            borderRadius='full'
                            boxSize='150px'
                            src={req.sender_image}
                            alt={req.sender_name}
                            fallbackSrc='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKaiKiPcLJj7ufrj6M2KaPwyCT4lDSFA5oog&usqp=CAU'
                            onClick={async (event) => {
                                try {
                                await navigate("/");
                                } catch (error) {
                                console.log(error);
                                }
                                // make this into a friend req PrivateOutlet
                            }}
                            />
                        </Box>
                        <Box p='2'>
                            <Text fontSize='md'>
                            {req.sender_name} has sent you a friend request!
                            </Text>
                        </Box>
                        <Spacer />
                        <ButtonGroup gap='2'>
                            <Button colorScheme='teal' onClick={() => updateAsFriends(req.request_from, req.docId)}>Accept</Button>
                            <Button bg='maroon' color='white' onClick={() => declineFriendRequest(req.docId)}>Decline</Button>
                        </ButtonGroup>
                        </Flex>
                    </Box>
                );
            })
            );
            // make this clickable so that you go to the user profile page. 
    }

      // add the other guys uid to your array of friends and vice versa. 


  return (
    <div>
      <NavBar />
      <Center>
        <Heading p='2'>My Notifications</Heading>
      </Center>

      <Tabs isFitted variant='soft-rounded' colorScheme='green'>
        <TabList mb="1em">
          <Tab>Event Invitations</Tab>
          <Tab>Friend Requests</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
          <VStack>
        <InvitationsTab />
      </VStack>
          </TabPanel>
          <TabPanel>

          <VStack>
          <BeFriendTab />
          </VStack>

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