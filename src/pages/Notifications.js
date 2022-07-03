import { React, useState, useEffect, /* useCallback */ } from "react";
import {
  collection,
  getDoc,
  // updateDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Box, Center, Heading, VStack, Image, Tabs, TabList, TabPanels, Tab, TabPanel, Flex, Text, Spacer, Button, ButtonGroup, Container, /* AspectRatio */ } from "@chakra-ui/react";

import NavBar from "../components/NavBar";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

export default function Notifications() {
  const { currentUser } = useAuth();
  const myId = currentUser.uid;
  const [myNotifications, setMyNotifications] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  const navigate = useNavigate();

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
        const secondArray = tempArray.map(
          (elem) => queryWithinLoop(elem) // what if i pass the output of the function into another function??? 
        ); //.map(elem => elem.then(value => { return value }).catch(err => { console.log(err) }));
        // deal with promises
        const promiseSolver = Promise.all(secondArray).then((values) => {
          return values;
        });
        const thirdArray = await promiseSolver;
        console.log("this is the third array already = ", thirdArray);
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
    console.log("inside of my []", myNotifications);
    // eslint-disable-next-line
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

  /* const getCourtData = async (elem) => {
    const courtDoc = doc(collection(db, "courts"), String(elem.event_venue)); // Firebase document id are Strings!!!
    const myCourtDoc = await getDoc(courtDoc);
    if (myCourtDoc.exists()) {
      const temp = {
        ...elem, 
        court_img: myCourtDoc.data().court_image,
        court_name: myCourtDoc.data().court_name,
        region: myCourtDoc.data().region,
      }
      // console.log("deepest loop = ", temp);
      return temp;
    } else {
      console.log("Error");
    }
  }; */

  function InvitationsTab() {
    /* async function navigateEvent(e) {
        try {
          await navigate("/");
        } catch (error) {
          console.log(error);
        }
      } */

    return(
        myNotifications.map((notify) => {
            // (notify, index) just use the doc id, since they are definitely unique.
            return (
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
              const newArray = tempArray.map(
                (elem) => getFriendData(elem) // function returns a promise
              );
              const promiseSolver = Promise.all(newArray).then((values) => {
                return values;
              });
              const anotherArray = await promiseSolver;
              // console.log("settle the kettle = ", anotherArray); GREAT SUCCCESS
              setFriendRequests(anotherArray);
        } catch (error) {
            console.log(error);
        }
    };
    getFriendRequests();
    console.log("friend requests", friendRequests);
    // eslint-disable-next-line
    }, []);

    const getFriendData = async (elem) => {
        const userDoc = doc(collection(db, "users"), elem.request_from);
        const myUserDoc = await getDoc(userDoc);
        if (myUserDoc.exists()) {
        const temp = {
            sender_name: myUserDoc.data().username,
            sender_image: myUserDoc.data().img,
            sender_level: myUserDoc.data().level,
            request_from: elem.request_from,
            friends_already: elem.friends_already,
        };
        // console.log("deepest loop = ", temp)
        return temp;
        } else {
        console.log("Error");
        }
    };

    function BefriendTab() {
        return (friendRequests.length === 0 ? 
            <Heading> 
                You currently have no friend requests
            </Heading> 
            :
            friendRequests.map((req) => {
                return (req.friends_already ?
                    <Heading key={req.id}>
                        make this into saying you and so and so are friends!
                    </Heading> 
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
                            <Button colorScheme='teal'>Accept</Button>
                            <Button colorScheme='teal'>Decline</Button>
                        </ButtonGroup>
                        </Flex>
                    </Box>
                );
            })
            );
            // make this clickable so that you go to the user profile page. 
    }

    /* const updateAsFriends = async (id) => {
        const userDoc = doc(db, "users", id);
        const myDoc = doc(db, "users", myId);
        const newFieldsThem = { age: age + 1 };
        const newFieldsMe = { age: age + 1 };
        await updateDoc(userDoc, newFields);
      }; */
      // add the other guys uid to your array of friends and vice versa. 

    // i have four buttons and functions to make -> accept invite, decline invite, accept friend and reject friend -> handleOnClick four times!!


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
        {/* <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
          <AvatarRipple
            display_picture=""
            user_name="{props.sender_name}"
            player_level="{props.sender_level}"
          />
        </Box> */}
      </VStack>
          </TabPanel>
          <TabPanel>

          <VStack>
          <BefriendTab />
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