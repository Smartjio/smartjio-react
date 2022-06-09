import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'
import { db, storage } from '../firebase';
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';

import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Select,
    Textarea,
    Heading,
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

    const [url, setUrl] = useState("")
    const [img, setImg] = useState("")
    const [username, setUsername] = useState("")
    const [location, setLocation] = useState("")
    const [level, setLevel] = useState("")
    const [introduction, setIntroduction] = useState("")

    const [error, setError] = useState('')
    const navigate = useNavigate()

    const data = {
        img: url,
        username: username,
        location: location,
        level: level,
        introduction: introduction
    }

    //console.log(uid)
    //console.log(data)

    useEffect(() => {
        const uploadImg = () => {
            const name = new Date().getTime() + img.name;
    
            console.log(name);
            const storageRef = ref(storage, `images/${name}`);
            const uploadTask = uploadBytesResumable(storageRef, img);
    
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                switch (snapshot.state) {
                    case "paused":
                    console.log("Upload is paused");
                    break;
                    case "running":
                    console.log("Upload is running");
                    break;
                    default:
                    break;
                }
                },
                (error) => {
                console.log(error);
                },
                () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    setUrl(downloadURL);
                });
                }
            );
        };
        img && uploadImg();
      }, [img]);

    const createUser = async () => {
        if (username === "" || location === "" || introduction === "" || level === "") {
            setError('Please fill in all inputs')
            console.log(error)
            return error
        } 
        try {
            await setDoc(doc(db, "users", currentUser.uid), data);
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
                <Avatar size="xl" src={
                    img
                    ? URL.createObjectURL(img)
                    : null} />
            </Center>
            <Center w="full">
                <Input 
                    type='file' 
                    onChange={(e) => setImg(e.target.files[0])} />
                <Button 
                    w="full"
                    onClick={(event) => {
                        setImg(event.target.files);
                    }}
                    >Change Icon</Button>
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
        <FormControl id="level" isRequired>
        <FormLabel>Level</FormLabel>
        <Select 
            placeholder='Select level' 
            onChange={(event) => {
                setLevel(event.target.value);}}>
            <option value='beginner'>Beginner</option>
            <option value='intermediate'>Intermediate</option>
            <option value='expert'>Expert</option>
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
