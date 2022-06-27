import React, { useState, useEffect } from 'react'
// import Card from '../components/PlayerCard' // maybe you should name properly
import { useParams } from 'react-router-dom';
// import { useAuth } from "../contexts/AuthContext"; // imported useAuth
// import { async } from "@firebase/util";
import { db } from "../firebase.js";
import Avatar from "../components/AvatarRipple"; // displaying of attendees. 
import NavBar from "../components/NavBar";

import {
  Box,
  // Container,
  // Stack,
  // Text,
  Image,
  // Flex,
  // VStack,
  // Button,
  Heading,
  // SimpleGrid,
  // StackDivider,
  // useColorModeValue,
  Center,
  WrapItem,
  Wrap,
  OrderedList,
  ListItem,
} from '@chakra-ui/react';

// import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
// import { MdLocalShipping } from 'react-icons/md';

import {
  collection,
  getDoc,
  // updateDoc,
  doc,
} from "firebase/firestore"; 

// the order of your functions matter alot. 

export default function Event() {
  /* when we arrive at this page from another page, we need to input parameters into this page before we can query the event */
  // const { currentUser } = useAuth(); // need this for join event function. 
  // console.log(currentUser);
  // const myID = currentUser.uid; never fking do this
  // console.log("current User = ", currentUser.uid);
  const { eid } = useParams(); // instead of let and var
  // console.log("event id = ", eid); // working

/*   const [courtImage, setCourtImage] = useState("");
  const [courtRegion, setCourtRegion] = useState("");
  const [courtName, setCourtName] = useState("");

  const [courtId, setCourtId] = useState(0);
  const [activity, setActivity] = useState("");
  const [organiser, setOrganiser] = useState("");
  const [organiserDoc, setOrganiserDoc] = useState({}); // how to initialize
  const [eventTime, setEventTime] = useState(""); // just a string for now, will change into Date() object in future

  const [attendees, setAttendees] = useState([]); // array of UID which will then loop through to create the avatars.
  const [attendeeDetail, setattendeeDetail] = useState([]); // .map from the above list:  {user_img:"", user_name:"", user_level:""} */

  const [myData, setMyData] = useState('');
  const [time, setTime] = useState("");
  // const participants = []; // try using this unhooked version first. 
  const [participants, setParticipants ]= useState([]);
  const [courtImg, setCourtImg ]= useState('');
  const [orgInfo, setOrgInfo] = useState('');

  let tempArray = [] // go through step by step how the whole page should render. 

  useEffect(() => {
    const getEvent = async () => {
      const eventsCollectionRef = collection(db, "events");
      const eventDocRef = doc(eventsCollectionRef, eid); // can just .id? 
      const eventData = await getDoc(eventDocRef);
      if (eventData.exists()) {
        // console.log("query id = ", eventData.data().court_id); // switching this console.log on can actually render more attendees...
        const data = eventData.data();
        setMyData(data);
        checkParticipants(data.attendees);
        getImg(data.court_id);
        getOrganiser(data.organiser);
        // console.log("query id = ", eventData.data().court_id);

        /* setOrganiser(eventData.data().organiser);
        setCourtId(eventData.data().court_id);
        setEventTime(eventData.data().time);
        setActivity(eventData.data().activity);
        setAttendees(eventData.data().attendees);  */
        const day = data.date.toDate().getDate();
        const month = data.date.toDate().getMonth();
        const year = data.date.toDate().getFullYear();
        const hour = data.date.toDate().getHours();
        let min = data.date.toDate().getMinutes().toString();
        while (min.length < 2) {
          min = "0" + min;
        }
        setTime(day + '/' + month + '/' + year + ' at ' + hour + ":" + min);
      } else {
        console.log("error")
        // navigate('/ErrorNotFound')
        // if event exists, navigate to error page -> Not working rn.
      }
    }; 

    getEvent();
    // eslint-disable-next-line 
  }, [eid]);

  // how do we ensure that this occurs only after the first query has occured?
  // console.log("attendanceList = ", myData.attendees); // is correct
  // console.log("attendance Data = ", participants); // only seems to be one person but 4x??? 
  // console.log("tempArray = ", tempArray);

  const checkParticipants = (myList) => {
    try {
      myList.forEach(element => {
        queryParticipants(element);
      });  
      setParticipants(tempArray); // not sure why it renders so many x of attendees... should be useEffect rendering. 
    } catch (error) {
      console.log(error);
    }
  }

  const queryParticipants = async (person) => {
    const docRef = doc(collection(db, "users"), person); // can just currentUser.uid -> reading properties of undefined 
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // tempArray = [...tempArray, docSnap.data()]
      // tempArray.push(docSnap.data());
      // setParticipants([...participants, docSnap.data()]);
      setParticipants(participants => [...participants, docSnap.data()]);
      setParticipants(participants => [...new Set(participants)]);
      // console.log("within my loop in queries", docSnap.data());
      // addPerson(docSnap.data());
    } else {
      console.log("error user not found");
    }
  }

  const getImg = async (courtId) => {
    try{
      const imgDocRef = doc(collection(db, "courts"), courtId); // can just .id? 
      const imgData = await getDoc(imgDocRef);
      console.log("query img = ", imgData.data()); // not working...
      setCourtImg(imgData.data().court_image);
    } catch (error) {
      console.log(error);
    }
  }; 

  // console.log("img data = ", courtImg);

  const getOrganiser = async (userId) => {
    try {
      const orgDocRef = doc(collection(db, "users"), userId);
      const orgData = await getDoc(orgDocRef);
      console.log("query org = ", orgData.data());
      setOrgInfo(orgData.data());
    } catch (error) {
      console.log(error);
    }
  }; 

  // useEffect happens after every render -> keeps adding people to the list... thats why so many extra pieces in your list. 
  // but without useEffect, myData.forEach runs forever... 

  // console.log(participants[0]); -> var component = function... best to write it within the return of the export default... idk why

  console.log(myData);
  console.log(time);
  return (
    <div>
      <NavBar />
      {/* <Text>{eid}</Text> */}
      <Image src={courtImg.court_image} />
      <Heading>Organiser of Event</Heading>
      <Avatar display_picture={orgInfo.img} user_name={orgInfo.username} player_level={orgInfo.level}/>
      <OrderedList>
        <ListItem>activity: {myData.activity}</ListItem>
        <ListItem>court is: {myData.court_id}</ListItem>
        <ListItem>organiser ID: {myData.organiser}</ListItem>
        <ListItem>time: {time}</ListItem>
      </OrderedList>
      <Wrap>
      {participants.map(function(person) {
    // console.log("inside the loop = ", person); // runs
    return (
      <WrapItem key={person}>
        <Box>
          <Center>
            <Avatar display_picture={person.img} user_name={person.username} player_level={person.level}/>
          </Center>
          {/* <Image src={person.img} />
          <Heading>player name: {person.username}</Heading>
          <Heading>player level: {person.level}</Heading> */}
        </Box>
      </WrapItem>
    )
  })}
      </Wrap>
    </div>
  )

/*   console.log("courtId = ", courtId);
  console.log("activity = ", activity);
  console.log("organiser = ", organiser);
  console.log("eventTime = ", eventTime);
  console.log("attendees = ", attendees);

  useEffect(() => {
    const getPeople = async () => { 
      attendees.map(person => async () => {
        try {
          const userCollectionRef = collection(db, "users");
          const userDocRef = doc(userCollectionRef, person); // user id => username, photo, level
          const userData = await getDoc(userDocRef);
          if (userData.exists()) {
            setattendeeDetail(attendeeDetail.push({user_img:userData.data().img, user_name:userData.data().username, user_level:userData.data().level}))
          } else {
            console.log("error");
          }
        } catch(error) {
          console.log(error);
          navigate('/ErrorNotFound');
        }
    })
    }; 
    getPeople();
    console.log(attendeeDetail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("attendeeDetail = ", attendeeDetail);

  useEffect(() => {
    const getCourt = async () => {
      const courtsCollectionRef = collection(db, "courts");
      const courtsDocRef = doc(courtsCollectionRef, courtId); // get court details
      const courtData = await getDoc(courtsDocRef);
      // if event exists, then court must definitely exist already.
      if (courtData.exists()) {
        setCourtImage(courtData.data().court_image);
        setCourtRegion(courtData.data().region);
        setCourtName(courtData.data().court_name);
      } else {
        navigate('/ErrorNotFound')
      }
    };
    getCourt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("court image = ", courtImage);
  console.log("region = ", courtRegion);
  console.log("name of court = ", courtName);

  var attendanceAvatars = attendees.map(function(person) {
    return (
      <WrapItem key={person}>
        <Box>
          <Center>
            <Avatar display_picture={person.user_img} user_name={person.user_name} player_level={person.user_level}/>
          </Center>
        </Box>
      </WrapItem>
    )
  })

  useEffect(() => {
    const getOrganiserDetails = async () => {
      const organiserCollectionRef = collection(db, "users");
      const organiserDocRef = doc(organiserCollectionRef, organiser); // get court details
      const organiserData = await getDoc(organiserDocRef);
      if (organiserData.exists()) {
        setOrganiserDoc({user_img:organiserData.data().img, user_name:organiserData.data().username, user_level:organiserData.data().level})
      } else {
        console.log("error");
      }
    }
    // to deal with the useEffect missing dependency issue, put useState within useEffect or use eslinter diable comment. 
    getOrganiserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("organiserDoc = ", organiserDoc);

  // display_picture, user_name, player_level

  var theOrganiser = <Card playerName={organiserDoc.user_name} level={organiserDoc.user_level} IMAGE={organiserDoc.user_img} />

  const joinEvent = async (id, attendanceList) => {
    // id is the event id.
    const eventDoc = doc(db, "events", id);
    const newFields = {attendanceList: attendanceList.push(currentUser.uid)}; // adding currentUser into the attendance list.
    await updateDoc(eventDoc, newFields);
  };

  return (
    <div>
      <NavBar />
      <Heading> {courtName}  </Heading>
      <Image>{courtImage}</Image>
       <Container maxW={'7xl'}>
        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 18, md: 24 }}>
          <Flex>
            <Image
              rounded={'md'}
              alt={'Court image'}
              src={
                courtImage
              }
              fit={'cover'}
              align={'center'}
              w={'100%'}
              h={{ base: '100%', sm: '400px', lg: '500px' }}
            />
          </Flex>
          <Stack spacing={{ base: 6, md: 10 }}>
            <Box as={'header'}>
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
                {activity}
              </Heading>
              <Text
                color={useColorModeValue('gray.900', 'gray.400')}
                fontWeight={300}
                fontSize={'2xl'}>
                {courtRegion}
              </Text>
            </Box>
  
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={'column'}
              divider={
                <StackDivider
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                />
              }>
              <VStack spacing={{ base: 4, sm: 6 }}>
                 <Text
                  color={useColorModeValue('gray.500', 'gray.400')}
                  fontSize={'2xl'}
                  fontWeight={'300'}>
                  {props.comments}
                </Text> 
                <Text fontSize={'lg'}>
                  {/* Date: {props.date} }
                  Time: {eventTime}
                </Text>

                <Wrap justify={'center'} spacing={'50px'}>
                {attendanceAvatars}
                </Wrap>

                <Box>
                <Text
                  fontSize={{ base: '16px', lg: '18px' }}
                  color={useColorModeValue('yellow.500', 'yellow.300')}
                  fontWeight={'500'}
                  textTransform={'uppercase'}
                  mb={'4'}>
                  Event Organiser
                </Text>
                {theOrganiser}
              
              </Box>
              </VStack>
  
            </Stack>
  
            <Button
              rounded={'none'}
              w={'full'}
              mt={8}
              size={'lg'}
              py={'7'}
              bg={useColorModeValue('gray.900', 'gray.50')}
              color={useColorModeValue('white', 'gray.900')}
              textTransform={'uppercase'}
              _hover={{
                transform: 'translateY(2px)',
                boxShadow: 'lg',
                
              }}
              onClick={() => joinEvent(eid, attendees)} >
              Join event: onClick, adds yourself to the event!
            </Button>
          </Stack>
        </SimpleGrid>
      </Container> 
    </div>

  ) */
}