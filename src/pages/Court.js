import NavBar from "../components/NavBar";
import { React, /* ReactElement */ useEffect, useState } from "react";
import { db } from "../firebase.js";
import { useParams } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
import AvatarRipple from "../components/AvatarRipple";

import {
  Box,
  Wrap,
  Text,
  // Stack,
  // Container,
  // Flex,
  Image,
  // StackDivider,
  // Button,
  // Input,
  // InputRightAddon,
  // InputGroup,
} from "@chakra-ui/react";

import { collection, getDoc, /* updateDoc */ doc } from "firebase/firestore";

/* function ImageQuery(userId) {
  const [user, setUser] = useState('');

  useEffect(() => {
    const getDisplay = async () => {
      const userDocRef = doc(db, "users", userId);
      const userData = await getDoc(userDocRef);
      if (userData.exists()) {
        setUser(userData.data());
      } else {
        console.log("error");
      }
    }
  }, [userId]);

  return (user.img);
} */

/* function addCommentButton() {
  const [value, setValue] = React.useState("");
  const handleChange = (event) => setValue(event.target.value);

  return (
    <Box bg="maroon" w="50%" p={4} color="black" align="center">
    <InputGroup size="lg">
      <Input placeholder="your comments" value={value} />
      <InputRightAddon>
        <Button colorScheme="teal" size="lg" onClick={() => (addComment(value))}>
          add comment
        </Button>
      </InputRightAddon>
    </InputGroup>
  </Box>
  );
} */

export default function Court() {
  const { cid } = useParams();
  // const { currentUser } = useAuth();
  // const [ currentUserInfo, setCurrentUserInfo ] = useState('');
  // console.log(cid);
  const [courtImage, setCourtImage] = useState("");
  const [courtName, setCourtName] = useState("");
  const [courtRegion, setCourtRegion] = useState("");
  const [courtActivity, setCourtActivity] = useState("");
  const [courtComments, setCourtComments] = useState([]); // comments are stored as a [] in firestore.

  useEffect(() => {
    const getCourtDoc = async () => {
      const courtDocRef = doc(collection(db, "courts"), cid); // can just .id?
      const courtData = await getDoc(courtDocRef);
      if (courtData.exists()) {
        setCourtImage(courtData.data().court_image);
        setCourtName(courtData.data().court_name);
        setCourtRegion(courtData.data().region);
        setCourtActivity(courtData.data().activity);
        setCourtComments(courtData.data().comments);
      } else {
        console.log("error");
      }
    };
    getCourtDoc();
  }, [cid]);

  console.log("them comments be like = ", courtComments);

  /* useEffect(() => {
    const getCourtDoc = async () => {
      g
    }
  }, []); */

  /* useEffect(() => {
    const getUserDoc = async () => {
      const userDocRef = doc(collection(db, "users"), currentUser.uid);
      const userData = await getDoc(userDocRef);
      if (userData.exists()) {
        setCurrentUserInfo(userData.data());
      } else {
        console.log("error");
      }
    };
    getUserDoc();
    }, [currentUser]); */

    // this useEffect is to get the current user info so that when commenting, it can be used. 
    
  /* const addComment = async (myComment) => {
    const myDoc = doc(db, "courts", cid);
    const newFields = { comments: courtComments.concat({comment: myComment, display_img: currentUserInfo.img, user_id: currentUser.uid, username: currentUserInfo.username}) };
    // cannot read value that is undefined??
    await updateDoc(myDoc, newFields);
  }; */

  /* const [value, setValue] = React.useState("");
  const handleChange = (event) => setValue(event.target.value); */

  return (
    <div>
      <NavBar />
      <Image src={courtImage} />
      <Text>{courtName}</Text>
      <Text>{courtRegion}</Text>
      <Text>{courtActivity}</Text>

      <Wrap>
        {courtComments.map(function (elem) {
          return (
            <Box bg="silver" w="50%" p={4} color="black" align="center">
              <AvatarRipple
                display_picture={elem.display_img}
                user_name={elem.username}
                player_level={elem.comment}
              />
              {/* <Text>{elem.username} says {elem.comment}</Text>
        <Text>user_id = {elem.user_id}  {ImageQuery(elem.user_id)} </Text> */}
            </Box>
          );
        })}
      </Wrap>

  {/* <Box bg="maroon" w="50%" p={4} color="black" align="center">
    <InputGroup size="lg">
      <Input placeholder="your comments" value={value} />
      <InputRightAddon>
        <Button colorScheme="teal" size="lg" onClick={() => (addComment(value))}>
          add comment
        </Button>
      </InputRightAddon>
    </InputGroup>
  </Box> */}
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
