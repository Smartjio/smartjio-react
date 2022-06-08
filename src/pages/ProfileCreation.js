import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase';
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Select,
    Textarea,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    Avatar,
    AvatarBadge,
    IconButton,
    Center,
  } from '@chakra-ui/react';
  import { SmallCloseIcon } from '@chakra-ui/icons';

export default function ProfileCreation() {
    const { currentUser } = useAuth();
    const uid = currentUser.uid;

    const [username, setUsername] = useState("")
    const [location, setLocation] = useState("")
    const [introduction, setIntroduction] = useState("")

    const [error, setError] = useState('')
    const navigate = useNavigate()

    const data = {
        username: username,
        location: location,
        introduction: introduction
    }

    //console.log(uid)
    //console.log(data)

    const createUser = async () => {
        try {
            await setDoc(doc(db, "users", uid), data);
        navigate("/")
        } catch {
            setError("Failed to create profile")
            console.log(error)
        }
      };

  return (
    <Flex
    minH={'100vh'}
    align={'center'}
    justify={'center'}
    bg={useColorModeValue('gray.50', 'gray.800')}>
    <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
        Create Your Profile
        </Heading>
        <FormControl id="userName">
        <FormLabel>Profile Icon</FormLabel>
        <Stack direction={['column', 'row']} spacing={6}>
            <Center>
            <Avatar size="xl" src='https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'>
                <AvatarBadge
                as={IconButton}
                size="sm"
                rounded="full"
                top="-10px"
                colorScheme="red"
                aria-label="remove Image"
                icon={<SmallCloseIcon />}
                />
            </Avatar>
            </Center>
            <Center w="full">
            <Button w="full">Change Icon</Button>
            </Center>
        </Stack>
        </FormControl>
        <FormControl id="username" isRequired>
        <FormLabel>Username</FormLabel>
        <Input
            placeholder="Username"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            onChange={(event) => {
                setUsername(event.target.value);}}
        />
        </FormControl>
        <FormControl id="location" isRequired>
        <FormLabel>Location</FormLabel>
        <Select 
            placeholder='Select location' 
            onChange={(event) => {
                setLocation(event.target.value);}}>
            <option value='north'>North</option>
            <option value='south'>South</option>
            <option value='east'>East</option>
            <option value='west'>West</option>
            <option value='central'>Central</option>
        </Select>
        </FormControl>
        <FormControl id="email" isRequired>
        <FormLabel>Introduction</FormLabel>
            <Textarea
            maxLength={50}
            placeholder='Write a short introduction of yourself (max 50 characters)'
            size='sm'
            onChange={(event) => {
                setIntroduction(event.target.value);}}
            />
        </FormControl>
        <Button
            bg={'blue.400'}
            color={'white'}
            w="full"
            _hover={{
            bg: 'blue.500',
            }}
            onClick={createUser}>
            Submit
        </Button>
    </Stack>
    </Flex>
    )
}
