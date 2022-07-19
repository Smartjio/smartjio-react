import NavBar from "../components/NavBar";
import { React, /* ReactElement */ useEffect, useState } from "react";
import { db } from "../firebase.js";
import { useParams } from "react-router-dom";
import PostMyComment from "../components/PostComment";

import {
  Box,
  // chakra,
  // Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  // Button,
  Heading,
  SimpleGrid,
  // StackDivider,
  // useColorModeValue,
  // VisuallyHidden,
  // List,
  // ListItem,
  Avatar,
  Badge,
  AspectRatio,
  Center,
  Divider,
  
} from '@chakra-ui/react';

import { collection, getDoc, doc } from "firebase/firestore";

// need to refresh page when i post a comment!

export default function TestPage() {
  const { cid } = useParams();
  // const { currentUser } = useAuth(); // for adding your own comments 
  // const myId = currentUser.uid;
  const [courtData, setCourtData] = useState(''); // everything about the court. 
  const [commentData, setCommentData] = useState([]); // for userImage etc 

  useEffect(() => {
    const getCourtDoc = async () => {
      const courtDocRef = doc(collection(db, "courts"), cid); 
      const theCourtData = await getDoc(courtDocRef);
      if (theCourtData.exists()) {
        setCourtData(theCourtData.data());
        // console.log(theCourtData.data());
        const tempArray = theCourtData.data().comments.map(
          (elem) => getCommentData(elem)
        );
        const promiseSolver = Promise.all(tempArray).then((values) => {
          return values;
        });
        const finalArray = await promiseSolver;
        // console.log("finalArray = ", finalArray);
        setCommentData(finalArray);
      } else {
        console.log("error");
      }
    };
    getCourtDoc();
  }, [cid]);

  // console.log("them comments be like = ", commentData);

  const getCommentData = async (elem) => {
    const userDoc = doc(collection(db, "users"), elem.user_id);
    const theUserDoc = await getDoc(userDoc);
    if (theUserDoc.exists()) {
      const temp = {
        comment: elem.comment,
        display_picture: theUserDoc.data().img,
        level: theUserDoc.data().level,
        user_name: theUserDoc.data().username,
      };
      // console.log("temp = ", temp);
      return temp;
    } else {
      console.log("Error");
    }
  }


  /* function SingleComment(props) {
    return (
      // do your thang... style quickly.
      <div>
        nada
      </div>
    ) abstraction principle has left the chat
  } */

  return (
    <div>
      <NavBar />

      <Heading as='h2' size='lg' px='25' py='2'>
        {courtData.court_name}
      </Heading>

      <SimpleGrid px={10} columns={[2, null]} spacing='15px'>
        <AspectRatio ratio={4 / 3}>
          <Image src={courtData.court_image} />
        </AspectRatio>

        <AspectRatio ratio={16 / 9}>
          <iframe src={courtData.gmaps} alt="demo" title='unique'/>
        </AspectRatio>
      </SimpleGrid>
      {/* <Box p='10' maxW='xl' borderRadius='lg' overflow='hidden'>

      </Box>
            <Box p='20' maxW='xl' borderRadius='lg' overflow='hidden'>

      </Box>
       */}

      <Center>
          <Stack direction='row' h='40px' p={2}>
            <Text fontSize='lg'>Located in the {courtData.region}</Text>
            <Divider orientation='vertical' />
            <Text fontSize='lg'>This court is for {courtData.activity}</Text>
          </Stack>
      </Center>

      <Center py='5'>
        <Box maxW='xxl' minW='xl' borderRadius='lg' bg='white' color='black'>
          <VStack>
          <Heading size='md'>Comments</Heading>
            <PostMyComment previous_comments={courtData.comments} court_id={cid} />
            {commentData.map((oneComment, index) => {
              return (
                <Flex>
                  <Avatar src={oneComment.display_picture} />
                  <Box ml='2'>
                    <Text fontWeight='bold'>
                      {oneComment.user_name}
                      <Badge ml='1' colorScheme='purple'>
                        {oneComment.level}
                      </Badge>
                    </Text>
                    <Text fontSize='sm'>{oneComment.comment}</Text>
                  </Box>
                </Flex>
              )
            }
            )}
          </VStack>
        </Box>
      </Center>
    </div>
  );
}

// import { library, icon } from '@fortawesome/fontawesome-svg-core'
// import Comments from '../components/Comments'
/* import {
  IoAnalyticsSharp,
  IoLogoBitcoin,
  IoSearchSharp,
} from 'react-icons/io5'; */

/* interface FeatureProps {
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
}; */

/*   return (
    <div>
      <NavBar />
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
            {courtName}
          </Text>
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
              text={courtName}
            />
            <Feature
              icon={<Icon as={IoLogoBitcoin} color={'green.500'} w={5} h={5} />}
              iconBg={useColorModeValue('green.100', 'green.900')}
              text={courtRegion}
            />
            <Feature
              icon={
                <Icon as={IoSearchSharp} color={'purple.500'} w={5} h={5} />
              }
              iconBg={useColorModeValue('purple.100', 'purple.900')}
              text={courtActivity}
            />
          </Stack>
        </Stack>
        <Flex>
          <Image
            rounded={'md'}
            alt={'feature image'}
            src={
              courtImage
            }
            objectFit={'cover'}
          />
        </Flex>
      </SimpleGrid>
    </Container>
    </div>
  );
}
 */
