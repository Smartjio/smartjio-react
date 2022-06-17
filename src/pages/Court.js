import { library, icon } from '@fortawesome/fontawesome-svg-core'
// import { ReactComponent as Logo } from './icons/radioactive.svg';
import Nav from '../components/NavBar'
import Comments from '../components/Comments'

import {
  IoAnalyticsSharp,
  IoLogoBitcoin,
  IoSearchSharp,
} from 'react-icons/io5';
import { ReactElement } from 'react';
import React from 'react'

import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  HStack,
  Container,
  VStack,
  Flex,
  SimpleGrid,
  Image,
  StackDivider,
  Icon,
} from '@chakra-ui/react';

const IMAGE = 'https://uci.nus.edu.sg/suu/wp-content/uploads/sites/5/2020/10/MPSH-1024x681.jpg'; // query this image from the database 
const NavBar = <Nav image='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6LGydG5ArmeGp6mcS56nwoqEGaVp2T7EbWg&usqp=CAU' />;
const userProfile = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8BXTP8qGIQ1OcbBtyySopofUV4WM0nQeIQ&usqp=CAU';
// const Content = <Comments />;

const myComments = <Comments text='this court is g' image={userProfile} />;

function allComments() {
  return (
    <div>
      <VStack>
        {myComments}
        {myComments}
        {/* This might not be viewble and why? */}
      </VStack>
    </div>
  )
}

const seeAllComments = <allComments />;

interface FeatureProps {
  text: string;
  iconBg: string;
  icon?: ReactElement;
}

const Feature = ({ text, icon, iconBg }: FeatureProps) => {
  return (
    <Stack direction={'row'} align={'center'}>
      <Flex
        w={8}
        h={8}
        align={'center'}
        justify={'center'}
        rounded={'full'}
        bg={iconBg}>
        {icon}
      </Flex>
      <Text fontWeight={600}>{text}</Text>
    </Stack>
  );
};


export default function Court(props) {
  const {court_name, court_location, court_activity} = props
  return (
    <div>
    <Container maxW={'5xl'} py={12}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Stack spacing={4}>
          <Text
            textTransform={'uppercase'}
            color={'blue.400'}
            fontWeight={600}
            fontSize={'sm'}
            bg={useColorModeValue('blue.50', 'blue.900')}
            p={2}
            alignSelf={'flex-start'}
            rounded={'md'}>
            Our Story
          </Text>
          <Heading>A digital Product design agency</Heading>
          <Text color={'gray.500'} fontSize={'lg'}>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore
          </Text>
          <Stack
            spacing={4}
            divider={
              <StackDivider
                borderColor={useColorModeValue('gray.100', 'gray.700')}
              />
            }>
            <Feature
              icon={
                <Icon as={IoAnalyticsSharp} color={'yellow.500'} w={5} h={5} />
              }
              iconBg={useColorModeValue('yellow.100', 'yellow.900')}
              text={'Business Planning'}
            />
            <Feature
              icon={<Icon as={IoLogoBitcoin} color={'green.500'} w={5} h={5} />}
              iconBg={useColorModeValue('green.100', 'green.900')}
              text={'Financial Planning'}
            />
            <Feature
              icon={
                <Icon as={IoSearchSharp} color={'purple.500'} w={5} h={5} />
              }
              iconBg={useColorModeValue('purple.100', 'purple.900')}
              text={'Market Analysis'}
            />
          </Stack>
        </Stack>
        <Flex>
          <Image
            rounded={'md'}
            alt={'feature image'}
            src={
              'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            }
            objectFit={'cover'}
          />
        </Flex>
      </SimpleGrid>
    </Container>
    <Comments />
    </div>
  );
}
