import {React, useState, useEffect} from 'react'
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase.js";

import { collection, getDoc, updateDoc, doc } from "firebase/firestore";
import {
    Box,
    Button,
    Flex,
    Image,
    Textarea,
    InputGroup,
    Container,
  } from "@chakra-ui/react";

export default function PostComment(props) {
    const [value, setValue] = useState(''); // for the textArea input!
    const [userImage, setUserImage] = useState("");
    const { currentUser } = useAuth(); // for adding your own comments 
    const myId = currentUser.uid;

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
    }, [myId]); // every time currentUser is called this useEffect will render. 

    const updateComments = async (laComment) => {
      const tempArray = props.previous_comments.concat([{comment: laComment, user_id: myId}]);
      const courtDoc = doc(db, "courts", props.court_id);
      const newFields = { comments: tempArray };
      await updateDoc(courtDoc, newFields);
    };
    let handleClickToPost = () => {
        if (value === "") {
            // do nothing?
            console.log("ye cant submit an empty comment");
            // make an alert? 
        } else {
            updateComments(value);
            // clears the input
            setValue(() => "");
            // window.location.reload();
        }
      }
  
      const handleInputChange = (e) => {
        let inputValue = e.target.value
        setValue(inputValue);
      }
  return (
    <Box bg='silver' w='100%' p={5} color='black' borderRadius='lg'>
        <Flex minWidth='max-content' alignItems='center'>
            <Container px='2'>
                <Image
                    borderRadius='full'
                    boxSize='100px'
                    src={userImage} // my own display picture which i will need to query.
                    alt='my dp'
                />
            </Container>
                <InputGroup gap='2'>
                    <Textarea
                    color='black'
                    value={value}
                    onChange={handleInputChange}
                    placeholder='Share your experiences about this court with others!'
                    size='lg'
                    />
                    <Button colorScheme='twitter' onClick={handleClickToPost} size='md'>
                    Post
                    </Button>
                </InputGroup>
        </Flex>
  </Box>
  )
}
