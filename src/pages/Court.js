import NavBar from "../components/NavBar";
import { React, /* ReactElement */ useEffect, useState } from "react";
import { db } from "../firebase.js";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  List,
  ListItem,
  Avatar,
  Badge,
  AspectRatio,
  Center,
  IconButton,
  Input,
} from '@chakra-ui/react';

import { collection, getDoc, doc, updateDoc } from "firebase/firestore";

import { MdEmail } from 'react-icons/md';
import { FaTrashAlt } from 'react-icons/fa';

export default function Court() {
    const navigate = useNavigate();

    const [triggerEffect, setTriggerEffect] = useState(false); // omg it works

    const { cid } = useParams();
    const { currentUser } = useAuth(); // for adding your own comments 
    const myId = currentUser.uid;

    const [courtData, setCourtData] = useState(''); // everything about the court. 
    const [commentData, setCommentData] = useState([]); // for userImage etc 

    const resetInput = () => "";
  
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
    }, [cid, triggerEffect]); // resetInput(), calling this function did not cause a rerender. 
  
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
          user_iden: elem.user_id,
        };
        // console.log("temp = ", temp);
        return temp;
      } else {
        console.log("Error");
      }
    }
  
    // below are the components that help deal with the comments -> make it into a functional component by itself. 
    
    function CommentSection() {
      const [value, setValue] = useState(''); // for the textArea input!
      const [userImage, setUserImage] = useState("");
  
      useEffect(() => {
        const getImage = async () => {
          const usersCollectionRef = collection(db, "users");
          const docRef = doc(usersCollectionRef, myId); 
          const docSnap = await getDoc(docRef); 
          if (docSnap.exists()) {
            setUserImage(docSnap.data().img);
          } else {
            setUserImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2aSUcU-KC_ZGl1KIFES1pwRe4YOMv2gPx_g&usqp=CAU");
          }
        };
        getImage();
      }, []); // will only run once: useEffect can run within another function????

      const updateComments = async (theComment) => {
        const tempArray = courtData.comments.concat([{comment: theComment, user_id: myId}]); // follows the order of things. 
        const courtDoc = doc(db, "courts", cid);
        const newFields = { comments: tempArray };
        await updateDoc(courtDoc, newFields);
      };
  
      let handleClickToPost = () => {
          if (value === "") {
              console.log("ye cant submit an empty comment");
              // no need to make an alert, just let it do nothing. 
          } else {
              updateComments(value);
              setValue(resetInput()); // when resetInput is called, the comments part will rerender such that your comment will be shown.
              setTriggerEffect(!triggerEffect); // cause a rerender!!
              // clears the input
              // setValue(""); // what is () => "" ???
              // window.location.reload(); // dont think i will need to reload to rerender some components here. 
          }
        }
    
        const handleInputChange = (e) => {
          let inputValue = e.target.value
          setValue(inputValue);
        }

      return (
          <Stack
            direction={{ base: 'column', md: 'row' }}
            as={'form'}
            spacing={'12px'}
            >
              <Avatar src={userImage} />
              <Input
                minW='lg'
                width="auto"
                size="lg"
                variant={'solid'}
                borderWidth={1}
                color={'gray.400'}
                _placeholder={{
                  color: 'gray.400',
                }}
                borderColor={useColorModeValue('gray.300', 'gray.700')}
                placeholder={'Your comments on this court'}
                aria-label={'Your comments on this court'}
                value={value} // for keeping tabs on the change.
                onChange={handleInputChange}
              />
              <Button onClick={handleClickToPost} size='lg'
                bg={useColorModeValue('gray.900', 'gray.50')}
                    color={useColorModeValue('white', 'gray.900')}
                    textTransform={'uppercase'}
                    _hover={{
                    transform: 'translateY(2px)',
                    boxShadow: 'lg',
                    }}
              >
                Post
              </Button>
            </Stack>
      )
    }

    function DisplayPerson(props) {
      return (
        <Flex 
        onClick={async (event) => {
            try {
            await navigate("/profile/" + props.player_id);
            } catch (error) {
            console.log(error);
            }
          }}
          >
          <VStack>
                <Badge ml='1' colorScheme='red'>
                  {props.level}
                </Badge>
            <Avatar src={props.img} />
            <Box ml='3'>
              <Text fontWeight='bold' fontSize='sm'>
                {props.username}
              </Text>
            </Box>
          </VStack>
        </Flex>
      )
    }

    const deleteMyComment = async (whatToDelete) => {
      const tempArray = courtData.comments.filter(statement => !(statement.comment === whatToDelete && statement.user_id === myId)); // if you then comment the same thing twice, both will be deleted. 
      console.log(courtData.comments, "what happened to my delete = ", tempArray);
      const courtDoc = doc(db, "courts", cid);
      const newFields = { comments: tempArray };
      await updateDoc(courtDoc, newFields);
      setTriggerEffect(!triggerEffect); // set something that is not the previous state
    }

    return (
        <div>
            <NavBar />
            <Container maxW={'7xl'}>
            <SimpleGrid
                columns={{ base: 1, lg: 1 }}
                spacing={{ base: 8, md: 10 }}
                py={{ base: 18, md: 5 }}>
                <Stack spacing={{ base: 6, md: 10 }}>
                    <Flex>
                    <Image
                        rounded={'md'}
                        alt={'product image'}
                        src={courtData.court_image}
                        fit={'cover'}
                        align={'center'}
                        w={'100%'}
                        h={{ base: '100%', sm: '400px', lg: '500px' }}
                    />
                    </Flex>
                </Stack>
                <Stack spacing={{ base: 6, md: 10 }}>
                <Box as={'header'}>
                    <Heading
                    lineHeight={1.1}
                    fontWeight={600}
                    fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
                    {courtData.court_name}
                    </Heading>
                    <Text
                    color={useColorModeValue('gray.900', 'gray.400')}
                    fontWeight={300}
                    fontSize={'2xl'}>
                    Sport: {courtData.activity}
                    </Text>
                </Box> 
        
                <Stack
                    spacing={{ base: 4, sm: 6 }}
                    direction={'column'}
                    divider={
                    <StackDivider
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                    />
                    }>
                    <Box>
                    <Text
                        fontSize={{ base: '16px', lg: '18px' }}
                        color={useColorModeValue('yellow.500', 'yellow.300')}
                        fontWeight={'500'}
                        textTransform={'uppercase'}
                        mb={'4'}>
                        Location
                    </Text>
        
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                        <List spacing={2}>
                        <AspectRatio ratio={16 / 9}>
                          <iframe src={courtData.gmaps} alt="demo" title='unique'/>
                        </AspectRatio>
                        </List>
                        <List spacing={2}>
                        <ListItem>
                        <Text
                          color={useColorModeValue('gray.500', 'gray.400')}
                          fontSize={'2xl'}
                          fontWeight={'300'}>
                          Postal Code: {cid}
                        </Text>
                        </ListItem>
                        <ListItem>
                        <Text
                          color={useColorModeValue('gray.500', 'gray.400')}
                          fontSize={'2xl'}
                          fontWeight={'300'}>
                          Region: {courtData.region}
                        </Text>
                        </ListItem>
                        </List>
                    </SimpleGrid>
                    </Box>

                    <Box>
                    <Text
                        fontSize={{ base: '16px', lg: '18px' }}
                        color={useColorModeValue('yellow.500', 'yellow.300')}
                        fontWeight={'500'}
                        textTransform={'uppercase'}
                        mb={'4'}>
                        Comments
                    </Text>
        
                    <List spacing={2}>
                    {commentData.map((oneComment, index) => { return (oneComment.user_iden === myId) ? (
                          <Stack spacing={4} direction={{ base: 'column', md: 'row' }} w={'full'} alignItems='center'>
                            <DisplayPerson img={oneComment.display_picture} level={oneComment.level} username={oneComment.user_name} player_id={oneComment.user_iden}/>
                            <Text fontSize='sm'>{oneComment.comment}</Text>
                            <IconButton size='sm' icon={<FaTrashAlt />} onClick={() => {deleteMyComment(oneComment.comment)}}/>
                          </Stack>
                    ) : (
                        <Stack spacing={4} direction={{ base: 'column', md: 'row' }} w={'full'} alignItems='center'>
                          <DisplayPerson img={oneComment.display_picture} level={oneComment.level} username={oneComment.user_name} player_id={oneComment.user_iden}/>
                          <Text fontSize='sm'>{oneComment.comment}</Text>
                        </Stack>
                    )
                    }
                      )}
                    </List>
                    </Box>
                </Stack>

                <Center>
                  <CommentSection />
                </Center>
        
                <Stack direction="row" alignItems="center" justifyContent={'center'}>
                    <MdEmail />
                    <Text>Want us to include a venue near you? Email smartJio@gmail.com</Text>
                </Stack>
                </Stack>
          </SimpleGrid>
        </Container>
        </div>
      );
    }




    /* function SeeAllComments() {
      return (
        <Stack spacing={4} direction={{ base: 'column', md: 'row' }} w={'full'}>
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
        </Stack>
      )
    } */