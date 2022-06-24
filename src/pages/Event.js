import React, { useState, useEffect } from 'react'
import Card from '../components/PlayerCard' // maybe you should name properly
import Nav from '../components/NavBar'
import { Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import { async } from "@firebase/util";
import { db } from "../firebase.js";
import Avatar from "../components/AvatarRipple"; // displaying of attendees. 
import NavBar from "../components/NavBar";

import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  HStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  VisuallyHidden,
  List,
  ListItem,
  Center,
  WrapItem,
  Wrap,
} from '@chakra-ui/react';

import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { MdLocalShipping } from 'react-icons/md';

import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  doc,
} from "firebase/firestore"; // for CRUD with firebase

export default function Event() {
  /* when we arrive at this page from another page, we need to input parameters into this page before we can query the event */
  const navigate = useNavigate(); // use nav to go from page to another page.
  const { currentUser } = useAuth(); // need this for join event function. 
  const myID = currentUser.uid;
  let { eid } = useParams();
  console.log(eid);

  const [courtImage, setCourtImage] = useState("");
  const [courtRegion, setCourtRegion] = useState("");
  const [courtName, setCourtName] = useState("");

  const [courtId, setCourtId] = useState(0);
  const [activity, setActivity] = useState("");
  const [organiser, setOrganiser] = useState("");
  const [organiserDoc, setOrganiserDoc] = useState({}); // how to initialize
  const [eventTime, setEventTime] = useState(""); // just a string for now, will change into Date() object in future

  const [attendees, setAttendees] = useState([]); // array of UID which will then loop through to create the avatars.
  const [attendeeDetail, setattendeeDetail] = useState([]); // .map from the above list:  {user_img:"", user_name:"", user_level:""}


  useEffect(() => {
    const getEvent = async () => {
      const eventsCollectionRef = collection(db, "events");
      const eventDocRef = doc(eventsCollectionRef, eid); // can just .id? 
      const eventData = await getDoc(eventDocRef);
      // what if the event does not exist?
      if (eventData.exists()) {
        setOrganiser(eventData.data().organiser);
        setCourtId(eventData.data().court_id);
        setEventTime(eventData.data().time);
        setActivity(eventData.data().activity);
        setAttendees(eventData.data().attendees); 
      } else {
        navigate('/ErrorNotFound')
        // if event exists, navigate to error page -> Not working rn.
      }
    }; 
    getEvent();
  });

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
  }, []);

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
  });

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
    getOrganiserDetails();
  });

  // display_picture, user_name, player_level

  // var organiserCard = <Card playerName='JoeMAMA' level='1' IMAGE='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe3AfZeiWn1Sf2YIAq4Bj4qVLW45gU2vCijQ&usqp=CAU' /> 

  var theOrganiser = <Card playerName={organiserDoc.user_name} level={organiserDoc.user_level} IMAGE={organiserDoc.user_img} />

  const joinEvent = async (id, attendanceList) => {
    // id is the event id.
    const eventDoc = doc(db, "events", id);
    const newFields = {attendanceList: attendanceList.push(myID)}; // adding currentUser into the attendance list.
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
                {/* <Text
                  color={useColorModeValue('gray.500', 'gray.400')}
                  fontSize={'2xl'}
                  fontWeight={'300'}>
                  {props.comments}
                </Text> */}
                <Text fontSize={'lg'}>
                  {/* Date: {props.date} */}
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
                {/* card for organiser. */}
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
              onClick={joinEvent(eid, attendees)} >
              Join event
              {/* onClick, how do i add this current user to the database? -> reference the userAuth */}
            </Button>
          </Stack>
        </SimpleGrid>
      </Container> 
      {/* <Simple image='https://uci.nus.edu.sg/suu/wp-content/uploads/sites/5/2020/10/MPSH-1024x681.jpg' activityType='Indoor Basketball' location='NUS UTSH 2' 
comments='Intermediate to advanced players are welcomed!' date='30/06/2022' startTime='4' endTime='6' timeOfDay='pm' /> */}
    </div>
  )
}