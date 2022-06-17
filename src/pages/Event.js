import React from 'react'
import Card from '../components/Card' // maybe you should name properly
import Nav from '../components/NavBar'

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
} from '@chakra-ui/react';

import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { MdLocalShipping } from 'react-icons/md';

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  where,
  query,
} from "firebase/firestore"; // for CRUD with firebase

import { db } from "../firebase.js"; // ../something 

const eventsRef = collection(db, "events");

{/* for importing modules, a single unique module can only be imported once. */}

// find a way to deal with the interfaces -> you just dont! 

// const attendanceList = query(eventsRef, where());


const myElement = <Simple image='https://uci.nus.edu.sg/suu/wp-content/uploads/sites/5/2020/10/MPSH-1024x681.jpg' activityType='Indoor Basketball' location='NUS UTSH 2' 
comments='Intermediate to advanced players are welcomed!' date='30/06/2022' startTime='4' endTime='6' timeOfDay='pm' />;

// my cards will have to loop through how many people are queried, and then stacked accordingly -> do i need to pass players cards as props? 

const NavBar = <Nav image='https://uci.nus.edu.sg/suu/wp-content/uploads/sites/5/2020/10/MPSH-1024x681.jpg' />; // my navbar

const player1 = <Card playerName='Labron' accolades='Elite' level='10' IMAGE='https://c4.wallpaperflare.com/wallpaper/442/195/630/lebron-james-nba-basketball-hoop-wallpaper-preview.jpg' />
const player2 = <Card playerName='JoeMAMA' accolades='GOD' level='1' IMAGE='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe3AfZeiWn1Sf2YIAq4Bj4qVLW45gU2vCijQ&usqp=CAU' /> 
const player3 = <Card playerName='AstroBoy' accolades='Beast' level='10' IMAGE='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR0bQ_HuoaPr89RZKGpkjaFx_Tkw9JhJNZoA&usqp=CAU' /> 

function attendees() {
  return (
    // all of my cards need to be returned within this function with the query logic. 
    <div> 
    </div> 
  )
} 

export default function Event() {
  /* when we arrive at this page from another page, we need to input parameters into this page before we can query the event */
  return (
    <div>
      {/* use components as such within the overarching div */}
      {NavBar}
      <Simple image='https://uci.nus.edu.sg/suu/wp-content/uploads/sites/5/2020/10/MPSH-1024x681.jpg' activityType='Indoor Basketball' location='NUS UTSH 2' 
comments='Intermediate to advanced players are welcomed!' date='30/06/2022' startTime='4' endTime='6' timeOfDay='pm' />
    </div>
  )
}

function Simple(props) {
  return (
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
              props.image
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
              {props.activityType}
            </Heading>
            <Text
              color={useColorModeValue('gray.900', 'gray.400')}
              fontWeight={300}
              fontSize={'2xl'}>
              {props.location}
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
                Date: {props.date}
                Time: {props.startTime} + {props.timeOfDay} + {props.endTime} + {props.timeOfDay} {/* change this to a variable*/}
              </Text>
            </VStack>

            <Box>
              <Text
                fontSize={{ base: '16px', lg: '18px' }}
                color={useColorModeValue('yellow.500', 'yellow.300')}
                fontWeight={'500'}
                textTransform={'uppercase'}
                mb={'4'}>
                Event Organiser
              </Text>

              {player3}

            </Box>

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
            }}>
            Join event
            {/* onClick, how do i add this current user to the database? -> reference the userAuth */}
          </Button>
        </Stack>
      </SimpleGrid>
    </Container>
  );
}