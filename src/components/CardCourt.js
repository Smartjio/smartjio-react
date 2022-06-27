import React from 'react'

import {
    Box,
    Center,
    useColorModeValue,
    Heading,
    Text,
    Stack,
    Image,
  } from '@chakra-ui/react';

import { collection, doc, setDoc } from "firebase/firestore"; 

const IMAGE = 'https://c4.wallpaperflare.com/wallpaper/442/195/630/lebron-james-nba-basketball-hoop-wallpaper-preview.jpg';

function Card (props) {
  return (
    <Center py={12}>
    <Box
      role={'group'}
      p={6}
      maxW={'330px'}
      w={'full'}
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'2xl'}
      rounded={'lg'}
      pos={'relative'}
      zIndex={1}>
      <Box
        rounded={'lg'}
        mt={-12}
        pos={'relative'}
        height={'230px'}
        _after={{
          transition: 'all .3s ease',
          content: '""',
          w: 'full',
          h: 'full',
          pos: 'absolute',
          top: 5,
          left: 0,
          backgroundImage: `url(${props.IMAGE})`,
          filter: 'blur(15px)',
          zIndex: -1,
        }}
        _groupHover={{
          _after: {
            filter: 'blur(20px)',
          },
        }}>
          {/* Here is where the image is brought into the card */}
        <Image
          rounded={'lg'}
          height={230}
          width={282}
          objectFit={'cover'}
          src={props.IMAGE}
        />
      </Box>
      <Stack pt={10} align={'center'}>
        <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
          Player Name 
        </Text>
        <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
          Lebron James 
        </Heading>
        <Stack direction={'row'} align={'center'}>
          <Text fontWeight={800} fontSize={'xl'}>
            aka the King 
          </Text>
          <Text textDecoration={'line-through'} color={'gray.600'}>
            Level 10 King
          </Text>
        </Stack>

        {/* testing the use of SVG here */}
        {/* <Logo /> */}
      </Stack>
    </Box>
    </Center>
    );
}

export default function Card()