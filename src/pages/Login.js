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
  } from '@chakra-ui/react';
import { Link as ReactLink, useNavigate } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState('')

    const { login, loading } = useAuth()
    const navigate = useNavigate()

    async function handleLogin(e) {

        try {
            await login(emailRef.current.value, passwordRef.current.value)
            navigate("/")
        } catch {
            setError('Failed to login')
            console.log(error)
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
                Log In
            </Heading>
            </Stack>
            <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
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
                    onClick={handleLogin}>
                    Log In
                </Button>
                </Stack>
                <Stack pt={6}>
                <Text align={'center'}>
                    Need an account? <Link as={ReactLink} color={'blue.400'} to="/signup">Sign Up</Link>
                </Text>
                </Stack>
            </Stack>
            </Box>
        </Stack>
        </Flex>
  )
}