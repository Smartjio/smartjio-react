import React, { useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
    Alert,
  } from '@chakra-ui/react';
import { Link as ReactLink, useNavigate } from 'react-router-dom'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmationRef = useRef()
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState('')

    const { signup, loading } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        console.log('Start')

        if (passwordRef.current.value !== passwordConfirmationRef.current.value) {
            console.log(passwordRef.current.value)
            console.log(passwordConfirmationRef.current.value)
            setError('Passwords do not match')
            return error
        }
        try {
            await signup(emailRef.current.value, passwordRef.current.value)
            navigate("/create")
        } catch (err) {
            handleErrorSignup(err);
            // console.log(err.code);
            // console.log(err.message);
            console.log(error);
        }
    }

    function handleErrorSignup(err) {
        switch (err.code) {
            case 'auth/email-already-in-use':
                setError('This email is already taken. Please use another email.');
                break;
            case 'auth/invalid-email':
                setError('Please input a valid email.');
                break;
            case 'auth/weak-password':
                setError('Please use a password with at least 6 characters.');
                break;
            default:
                setError(err.message);
        }
    }

    return (
        <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
                Sign up
            </Heading>
            </Stack>
            <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
                {error && <Alert status="error"> {error} </Alert>}
                <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input type="email" ref={emailRef}/>
                </FormControl>
                <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={showPassword ? 'text' : 'password'} ref={passwordRef}/>
                    <InputRightElement h={'full'}>
                    <Button
                        variant={'ghost'}
                        onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                        }>
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                    </InputRightElement>
                </InputGroup>
                </FormControl>
                <FormControl id="passwordConfirmation" isRequired>
                <FormLabel>Password Confirmation</FormLabel>
                <InputGroup>
                    <Input type={showPassword ? 'text' : 'password'} ref={passwordConfirmationRef}/>
                    <InputRightElement h={'full'}>
                    <Button
                        variant={'ghost'}
                        onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                        }>
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                    </InputRightElement>
                </InputGroup>

                </FormControl>
                <Stack spacing={10} pt={2}>
                <Button
                    loadingText="Submitting"
                    size="lg"
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                    bg: 'blue.500',
                    }}
                    isDisabled={loading}
                    onClick={handleSubmit}>
                    Sign up
                </Button>
                </Stack>
                <Stack pt={6}>
                <Text align={'center'}>
                    Already a user? <Link as={ReactLink} color={'blue.400'} to="/login">Log In</Link>
                </Text>
                </Stack>
            </Stack>
            </Box>
        </Stack>
        </Flex>
  )
}
