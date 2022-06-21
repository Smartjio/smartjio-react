import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase';

import {
    Text,
    Avatar,
    Box,
    Flex,
    Button,
    useColorModeValue,
    HStack,
  } from '@chakra-ui/react';

export default function ProfilePage() {
  const { uid } = useParams();
  const [ error, setError ] = useState('');
  const [ data, setData ] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

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

  console.log(data);

  async function handleLogout(e) {
      try {
          await logout()
          navigate('/login')
      } catch (err) {
          setError(err)
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
            <HStack spacing={5}>
            <Avatar
              size={'2xl'}
              src={data.img}
              alt={'Avatar Alt'}
              mb={4}
              pos={'relative'}
              textAlign={'center'}
            />
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
