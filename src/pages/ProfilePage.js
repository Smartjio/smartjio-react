import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase';

import {
    Heading,
    Text,
    Avatar,
    Box,
    Flex,
    Center,
    Button,
    useColorModeValue,
    Stack,
  } from '@chakra-ui/react';

export default function ProfilePage() {
  const [ error, setError ] = useState('');
  const [ data, setData ] = useState('');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "users", currentUser.uid);
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
  }, [currentUser]);

  console.log(data);

  async function handleLogout(e) {
      try {
          await logout()
          navigate('/login')
      } catch {
          setError('Failed to log out')
          console.log(error)
      }
  }

  return (
      <Flex
      // minH={'100vh'}
      // align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      {/* <Center py={6}> */}
        <Box
          w={'80vw'}
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
              // added
              // added
              pos={'relative'}
            />
            <Box
              textAlign={'left'}>
              <Text fontSize={'xl'} fontFamily={'body'}>
              Username: { data.username }
              </Text>
            </Box>
              <Button
              flex={1}
              fontSize={'sm'}
              rounded={'full'}
              bg={'blue.400'}
              color={'white'}
              boxShadow={
                  '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
              }
              _hover={{
                  bg: 'blue.500',
              }}
              _focus={{
                  bg: 'blue.500',
              }}
              onClick={handleLogout}>
              Log Out
              </Button>
          </Box>
      {/* </Center> */}
      </Flex>
    );
}
