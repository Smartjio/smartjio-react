import { React, useState, useEffect /* useCallback */ } from "react";
import {
  collection,
  getDoc,
  doc,
} from "firebase/firestore";
import {
  Box,
  Heading,
  VStack,
  Image,
  Text,
  SimpleGrid,
  useColorModeValue,
  List,
  ListItem,
  HStack,
  Avatar,
  Badge,
} from "@chakra-ui/react";

import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import SportIcon from "../components/SportSVG";

// an event object will be input through 

export function ActivityBoxes({participants, court_id, date, c1, c2, organiser, sport}) {
    const [theDate, setDate] = useState(""); // a string representation. 
    const [court_data, setCourtData] = useState(''); // just one court object. 
    const [users_data, setUserData] = useState([]); // an array of user objects that will be queried. 

    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const myId = currentUser.uid;

    useEffect(() => {
        const day = date.getDate();
        const month = date.getMonth() + 1; // not sure why converting from a firebase date object to a js date will cause a decrease in one month. 
        const year = date.getFullYear();
        const hour = date.getHours();
        let min = date.getMinutes().toString();
        while (min.length < 2) {
          min = "0" + min;
        }
        setDate(day + '/' + month + '/' + year + ' at ' + hour + ":" + min); // this is causing the infinite loop! -> put it inside of an useEffect. 
    }, [date]);

    const getParticipants = async (user_id) => {
        const userDoc = doc(collection(db, "users"), user_id);
        const myUserDoc = await getDoc(userDoc);
        if (myUserDoc.exists()) {
          const temp = {
                player_name: myUserDoc.data().username,
                player_image: myUserDoc.data().img,
                player_level: myUserDoc.data().level,
                player_id: user_id, // for onclick -> see the other player profile. 
            };
            return temp;
        } else {
          console.log("Error");
        }
      }
    
      const getCourt = async (court_id) => {
        const courtDoc = doc(collection(db, "courts"), court_id);
        const myCourtDoc = await getDoc(courtDoc);
        if (myCourtDoc.exists()) {
          const temp = {
                court_image: myCourtDoc.data().court_image,
                court_name: myCourtDoc.data().court_name,
                court_region: myCourtDoc.data().region,
                court_id: court_id, // for onclick -> see the court page 
            };
            // console.log("court query = ", temp)
            return temp;
        } else {
          console.log("Error");
        }
      }

      useEffect(() => {
        const getInfo = async () => {
            try {
                const tempArray = participants.map((person) => getParticipants(person));
                const promiseSolver = Promise.all(tempArray).then((values) => {
                  return values;
                });
                const theArray = await promiseSolver;
                setUserData(theArray); // pray to god this works. 
                setCourtData(await getCourt(court_id));
            } catch (error) {
                console.log(error);
            }
        };
        getInfo();
        }, [participants, court_id]); 

    function DisplayUsers({name, displayPic, level, id}) {
        return ((id === myId) ? (
            <Box onClick={() => navigate("/profile/" + id)} width='100px' alignItems='center' >
                <VStack>
                    <Badge ml='1' colorScheme='yellow'>
                        {level}
                    </Badge>
                    <Avatar src={displayPic} size='lg'/>
                    <Text fontWeight='bold'>
                    {name}
                    </Text>
                </VStack>
            </Box>
        ) : ((id === organiser) ? (
            <Box onClick={() => navigate("/profile/" + id)} width='100px' alignItems='center'>
                <VStack>
                    <Badge ml='1' colorScheme='purple'>
                        {level}
                    </Badge>
                    <Avatar src={displayPic} size='lg'/>
                    <Text fontWeight='bold'>
                    {name}
                    </Text>
                </VStack>
            </Box> 
        ) : (
            <Box onClick={() => navigate("/profile/" + id)} width='100px' alignItems='center'>
                <VStack>
                    <Badge ml='1' colorScheme='teal'>
                        {level}
                    </Badge>
                    <Avatar src={displayPic} size='lg'/>
                    <Text fontWeight='bold'>
                    {name}
                    </Text>
                </VStack>
            </Box>
        ))
        )
    }


  return (
    <Box>
        <Text
            fontSize={{ base: '16px', lg: '18px' }}
            color={useColorModeValue(c1, c2)}
            fontWeight={'500'}
            textTransform={'uppercase'} 
            mb={'4'}>
            {theDate}
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <List spacing={2}>
            <Image src={court_data.court_image} onClick={() => navigate("/court/" + court_data.court_id)}/> 
            <ListItem>
                <HStack>
                    <Text>{court_data.court_name}</Text>
                <SportIcon what={sport} />
                </HStack>
            </ListItem>
        </List>

        <Box>
            <VStack spacing={'2'}>
            <Heading      
                size="sm"       
                color={useColorModeValue('purple.500', 'purple.300')}
                fontWeight={'500'}
                textTransform={'uppercase'} 
                mb={'4'}>
                Participants
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10}>
                {users_data.map((person) => {
                    return (
                        <DisplayUsers name={person.player_name} displayPic={person.player_image} level={person.player_level} id={person.player_id} />
                    )
                })}
            </SimpleGrid>

            </VStack>
        </Box>

        </SimpleGrid>
    </Box>
  )
}
