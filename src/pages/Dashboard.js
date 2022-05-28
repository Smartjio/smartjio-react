import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

import {
    Heading,
    Avatar,
    Box,
    Flex,
    Center,
    Button,
    useColorModeValue,
  } from '@chakra-ui/react';

export default function Dashboard() {
    const [ error, setError ] = useState('')
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate()

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
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Center py={6}>
          <Box
            maxW={'320px'}
            w={'full'}
            bg={useColorModeValue('white', 'gray.900')}
            boxShadow={'2xl'}
            rounded={'lg'}
            p={6}
            textAlign={'center'}>
            <Avatar
              size={'xl'}
              src={'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'}
              alt={'Avatar Alt'}
              mb={4}
              pos={'relative'}
              _after={{
                content: '""',
                w: 4,
                h: 4,
                bg: 'green.300',
                border: '2px solid white',
                rounded: 'full',
                pos: 'absolute',
                bottom: 0,
                right: 3,
              }}
            />
                <Heading fontSize={'2xl'} fontFamily={'body'}>
                { currentUser.email }
                </Heading>
                
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
        </Center>
        </Flex>
      );
}
