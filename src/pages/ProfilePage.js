import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

import NavBar from '../components/NavBar'
import {
    Text,
    Avatar,
    Box,
    Flex,
    useColorModeValue,
    HStack,
  } from '@chakra-ui/react';

import FriendButton from '../components/FriendButton';

export default function ProfilePage() {
  const { uid } = useParams();
  const [ data, setData ] = useState('');

  const { currentUser } = useAuth();

  const isUser = uid === currentUser.uid;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("Error! No such document!");
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [uid]);

  return (
    <>
      <NavBar />
      <Flex
      // minH={'100vh'}
      // align={'center'}
      p={2}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      {/* <Center py={6}> */}
        <Box
          w={'80vw'}
          maxW={'1000px'}
          bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'2xl'}
          rounded={'lg'}
          p={6}
          textAlign={'center'}>
            <Avatar
              size={'2xl'}
              src={data.img}
              alt={'Avatar Alt'}
              mb={4}
              pos={'relative'}
              textAlign={'center'}
            />
            <HStack spacing={5}>
            <Box
              textAlign={'left'}>
              <Text fontSize={'xl'} fontFamily={'body'}>
              <Text as='u'>Username:</Text> { data.username }
              </Text>
              <Text fontSize={'xl'} fontFamily={'body'}>
              <Text as='u'>Location:</Text> { data.location }
              </Text>
              <Text fontSize={'xl'} fontFamily={'body'}>
              <Text as='u'>Level:</Text> { data.level }
              </Text>
              <Text fontSize={'xl'} fontFamily={'body'} as='u'>
              Introduction:
              </Text>
              <Text fontSize={'xl'} fontFamily={'body'} noOfLines={[1, 2, 3]}>
              { data.introduction}
              </Text>
            </Box>
            </HStack>
            {!isUser && <FriendButton id={ uid }/>}
          </Box>
      {/* </Center> */}
      </Flex>
    </>
    );
}
