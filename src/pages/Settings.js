import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, storage } from '../firebase';
import { doc, setDoc } from "firebase/firestore";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
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
    Center,
    Alert,
  } from '@chakra-ui/react';

import NavBar from '../components/NavBar'

export default function EventCreation() {
  const { currentUser, userData } = useAuth();

    const [url, setUrl] = useState(userData.img)
    const [img, setImg] = useState("")
    const [username, setUsername] = useState(userData.username)
    const [location, setLocation] = useState(userData.location)
    const [level, setLevel] = useState(userData.level)
    const [introduction, setIntroduction] = useState(userData.introduction)

    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("")

    const [error, setError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const navigate = useNavigate()

    const data = {
        img: url,
        username: username,
        location: location,
        level: level,
        introduction: introduction
    }

    const noChangeDetails = (url === userData.img && username === userData.username && location === userData.location && introduction === userData.introduction && level === userData.level);
    const different = newPassword !== newPasswordConfirmation;
    
    // console.log(currentUser.email)

    // (url === userData.img && username === userData.username && location === userData.location && introduction === userData.introduction && level === userData.level)
    //console.log(uid)
    //console.log(data)
    //console.log(img)

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

    const updateUser = async () => {
        try {
            await setDoc(doc(db, "users", currentUser.uid), data);
            navigate("/profile/" + currentUser.uid)
        } catch {
            // handleError(error);
            setError("Failed to update profile")
            console.log(error);
        }
      };

    const updateUserPassword = async () => {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        oldPassword
      )
      await reauthenticateWithCredential(
        currentUser, 
        credential
      ).then(() => {
        updatePassword(currentUser, newPassword).then(() => {
          navigate("/profile/" + currentUser.uid)
        }).catch((error) => {
          handlePasswordError(error);
          console.log(error + "updating error")
        })}).catch((error) => {
          handlePasswordError(error);
          console.log(error + "credential error")
        });
      }

      function handlePasswordError(err) {
        switch (err.code) {
            case 'auth/weak-password':
                setPasswordError('Please use a password with at least 6 characters.');
                break;
            case 'auth/wrong-password':
                setPasswordError('Incorrect password. Please try again.');
                break;
            default:
                setPasswordError(err.message);
        }
    }
      

  return (
    <>
    <NavBar />
    <Flex
    p={2}
    justify={'center'}
    bg={useColorModeValue('gray.50', 'gray.800')}>
    <Stack
        spacing={4}
        w={'full'}
        maxW={'lg'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
        Edit Your Profile
        </Heading>
        {error && <Alert status="error"> {error} </Alert>}
        <FormControl id="icon">
        <FormLabel>Profile Icon</FormLabel>
        <Stack direction={['column', 'row']} spacing={6}>
            <Center>
                <Avatar 
                size="xl"
                src={
                    url
                    ? url
                    : userData.img} />
            </Center>
            <Center w="full">
            <FormControl>
                <Button w="full">
                    <FormLabel w="full" m={0}><Center>Change Icon</Center></FormLabel>
                    <Input 
                        w="full"
                        type='file' 
                        onChange={(e) => setImg(e.target.files[0])} 
                        style={{ display: "none"}}
                        />
                </Button>
            </FormControl>
            </Center>
        </Stack>
        </FormControl>
        <FormControl id="username">
        <FormLabel>Username</FormLabel>
        <Input
            placeholder="Username"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            onChange={(event) => {
                setUsername(event.target.value);}}
        />
        </FormControl>
        <FormControl id="location">
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
        <FormControl id="level">
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
        <FormControl id="introduction">
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
            onClick={updateUser}
            isDisabled={noChangeDetails}>
            Update Profile
        </Button>

        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
        Change your password
        </Heading>
        {passwordError && <Alert status="error"> {passwordError} </Alert>}
        <FormControl id="oldPassword">
        <FormLabel>Old Password</FormLabel>
        <Input
            placeholder="Old Password"
            _placeholder={{ color: 'gray.500' }}
            type="password"
            onChange={(event) => {
                setOldPassword(event.target.value);}}
        />
        </FormControl>
        <FormControl id="newPassword">
        <FormLabel>New Password</FormLabel>
        <Input
            placeholder="New Password"
            _placeholder={{ color: 'gray.500' }}
            type="password"
            onChange={(event) => {
                setNewPassword(event.target.value);}}
        />
        </FormControl>
        <FormControl id="newPasswordConfirmation">
        <FormLabel>New Password Confirmation</FormLabel>
        <Input
            placeholder="New Password Confirmation"
            _placeholder={{ color: 'gray.500' }}
            type="password"
            onChange={(event) => {
                setNewPasswordConfirmation(event.target.value);}}
        />
        </FormControl>
        <Button
            bg={'blue.400'}
            color={'white'}
            w="full"
            _hover={{
            bg: 'blue.500',
            }}
            onClick={updateUserPassword}
            isDisabled={different}>
            Change Password
        </Button>
    </Stack>
    </Flex>
    </>
    )
}
