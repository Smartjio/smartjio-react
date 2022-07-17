import { React, useState, useEffect, /* useCallback */ } from "react";
import {
  collection,
  getDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { Box, Heading, Image, Flex, Text, Button, Container, /* AspectRatio */
SimpleGrid, 
Stack,
useColorModeValue,
StackDivider, 
HStack,
Avatar,
Input, 
Badge,
InputGroup,
Alert,
AlertIcon,
AlertTitle,
AlertDescription,
CloseButton,
useDisclosure, } from "@chakra-ui/react";

import SportIcon from "../components/SportSVG";

import NavBar from "../components/NavBar";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
// import AddToCalendarButton from 'react-add-to-calendar';

export default function Event() {

  const [triggerEffect, setTriggerEffect] = useState(false);

  const navigate = useNavigate();
  const { eid } = useParams();
  const { currentUser } = useAuth();
  const myId = currentUser.uid;
  const [myEventData, setMyEventData] = useState(''); // everything will take place within this one single object. 
  const [participants, setParticipants] = useState([]);
  const [courtData, setCourtData] = useState('');
  const [organiserData, setOrganiserData] = useState('');
  const [myFriends, setMyFriends] = useState([]); // for the autosuggestion thing. 
  const [ date, setDate ] = useState('');
  const [notifications, setNotifications] = useState([]);

  // join / leave event -> rerender on click -> triggerEffect hook.

  const AddToEvent = async (id) => {
    const EventDoc = doc(db, "events", eid);
    const tempArray = myEventData.attendees.concat([id]);
    const newFields = { attendees: tempArray };
    await updateDoc(EventDoc, newFields);
    setTriggerEffect(!triggerEffect);
  };

  const DeleteFromEvent = async (id) => {
    const EventDoc = doc(db, "events", eid);
    const tempArray = myEventData.attendees.filter(person => person !== id); // removes person. 
    if (tempArray.length === 0) {
      navigate("/"); // does order matter here?
      await deleteDoc(EventDoc);
      // if there is no one in the event, then the event will cease to exist, person to last leave the event will be rerouted to the dashboard. 
    } else {
      const newFields = { attendees: tempArray };
      await updateDoc(EventDoc, newFields);
      setTriggerEffect(!triggerEffect);
    }
  };

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
        // console.log("participant loop = ", temp)
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
    const getFriendDoc = async () => {
      const userDocRef = doc(collection(db, "users"), myId); 
      const userData = await getDoc(userDocRef);
      if (userData.exists()) {
        const tempArray = userData.data().friends.map((person) => getParticipants(person));
        const promiseSolver = Promise.all(tempArray).then((values) => {
          return values;
        });
        const theArray = await promiseSolver;
        console.log("all my friends = ", theArray)
        setMyFriends(theArray)
      } else {
        console.log("error");
      }
    };
    getFriendDoc();
  }, [myId]);

  useEffect(() => {
    const getEventDoc = async () => {
      const eventDocRef = doc(collection(db, "events"), eid); 
      const eventData = await getDoc(eventDocRef);
      if (eventData.exists()) {
        setMyEventData(eventData.data());

        const day = eventData.data().date.toDate().getDate();
        const month = eventData.data().date.toDate().getMonth();
        const year = eventData.data().date.toDate().getFullYear();
        const hour = eventData.data().date.toDate().getHours();
        let min = eventData.data().date.toDate().getMinutes().toString();
        while (min.length < 2) {
          min = "0" + min;
        }
        setDate(day + '/' + month + '/' + year + ' at ' + hour + ":" + min); // use date object state hook to display later.
        
        const tempArray = eventData.data().attendees.map((person) => getParticipants(person));
        const promiseSolver = Promise.all(tempArray).then((values) => {
          return values;
        });
        const theArray = await promiseSolver;
        // console.log("theArray is = ", theArray);
        setParticipants(theArray);
        setCourtData(await getCourt(eventData.data().court_id)); // still needed that await there. 
        setOrganiserData(await getParticipants(eventData.data().organiser));
      } else {
        console.log("error");
      }
    };
    getEventDoc();
  }, [eid, triggerEffect]);
  // cannot add the addToevent and deletefromevent into the dependency array -> use triggerEffect hook.

  // console.log("all details = ", myEventData, participants, courtData);

  function MeInEvent() {
    if (myEventData.attendees === undefined) {
      // console.log("still waiting for your useEffects to render");
    } else {
      if (myEventData.attendees.includes(myId)) {
        return (
          // <Text> HUAT AH </Text>
          true
        );
      } else {
        return (
          // <Text> means i not inside this event lah. </Text>
          false
        );
      }
    }
  }

  const createEventInvitation = async (friend_id) => {
    await addDoc(collection(db, "notification"), { event_id: eid, recipient: friend_id, sender: myId });
  };

  const whichBadgeColour = (user_id, index) => {
    if (index > myEventData.event_limit) {
      return "pink"
      // take note to update all to event_limit: you can still join when participants are over the limit, just displayed pink.
    } else {
      if (user_id === myId) {
        return "yellow";
      } else {
        return "green";
      }
    }
  };

  function OneParticipant(props) {
    return ( props.player_id === myEventData.organiser ?
      <HStack></HStack>
    : 
    <Flex align="center" >
      <Avatar src={props.player_image} name={props.player_name} size='lg' 
        onClick={async (event) => {
                            try {
                            await navigate("/profile/" + props.player_id);
                            } catch (error) {
                            console.log(error);
                            }
                        }}/>
      <Box ml='3' alignItems=''>
        <Text fontWeight='bold'>
        {props.player_name}
          <Badge ml='1' colorScheme={whichBadgeColour(props.player_id, props.index)}>
          {props.player_level}
          </Badge>
        </Text>
      </Box>
    </Flex>
    // basically dont return anything if participant = organiser
    )
  }

  // this function goes through the participants loop.
  function ViewParticipants() {
    return (
      <Stack
      spacing={4}
      divider={
        <StackDivider
          borderColor={useColorModeValue('gray.100', 'gray.700')}
        />
      }>
      {participants.map((elem, idx) => {
        return (<OneParticipant key={elem.player_id} index={idx} player_image={elem.player_image} player_name={elem.player_name} player_level={elem.player_level} player_id={elem.player_id}/> )
      })}
    </Stack>
    )
  }

  // include a search friend bar to invite your friends with autosuggestion to select!!!!

  // why everytime i refresh then i will be inside the event??? 
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState([]); // wtf is initialState? 

  const onSuggestHandler = (text) => {
    setText(text.player_name);
    setSuggestions([]); // to remove the suggestions after selection
  }

  const onChangeHandler = (text) => {
    let matches = [];
    if (text.length > 0) {
      matches = myFriends.filter(usr => {
        const regex = new RegExp(`${text}`, "gi");
        return usr.player_name.match(regex);
      })
      // matches = temp.filter(participants.forEach()) // let the Enter button handle the logic of not inviting the people already in this event.
    }
    // console.log("the matches = ", matches);
    setSuggestions(matches); // should be friend user objects. 
    setText(text);
  }

  // need to query first before anything.
  useEffect(() => {
    const notInvitedYet = async () => {
      const tempArray = [];
      try {
        const myQuery = query(
          collection(db, "notification"),
          where("event_id", "==", eid),
        );
        const queryResults = await getDocs(myQuery); // will this ever be empty
        // console.log("checking who has been invited", queryResults);
        queryResults.forEach((doc) => {
          const tempObject = doc.data()
          tempObject.docId = doc.id;
          tempArray.push(tempObject);
        });
        setNotifications(tempArray);
      } catch (error) {
        console.log(error);
      }
    };
    notInvitedYet();
  }, [text, eid, triggerEffect]); // rerun everytime we click! createEventInvitation, and triggerEffect!

  function JoinEventButton() {
    // let invitationStatus = false;
    // let showText = '';
    // console.log("query result = ", notifications);

    const {
      isOpen: isVisible,
      onClose,
      onOpen,
    } = useDisclosure({ defaultIsOpen: false })

    // might need to be async
    const onClickJioFriend = (friend_username) => {
      if (friend_username !== "") {
        const jioFriend = myFriends.find((person) => person.player_name === friend_username); // find the first instance of this dude
        const tempArray = participants.filter((friend_obj) => friend_obj.player_name === friend_username);
        if (tempArray.length === 0) {
          // if friend is not already inside of this event, we need to add him to the event.
          if (notifications.filter((notif) => notif.recipient === jioFriend.player_id).length === 0) {
            createEventInvitation(jioFriend.player_id);
            // showText = text;
            // setText(''); // empty
            // invitationStatus = true;
            onOpen();
          } else {
            // invitationStatus = false;
            // showText = text;
            // setText(''); // empty
            onOpen();
          }
        } else {
          onOpen();
        }
      }
    }

    const improvedClose = () => {
      onClose();
      setTriggerEffect(!triggerEffect);
    }
  
    return isVisible ? (
      (participants.filter((friend_obj) => friend_obj.player_name === text).length === 0) ?
        (notifications.filter((notif) => notif.recipient === myFriends.find((person) => person.player_name === text).player_id).length === 0) ?
        <Alert status='success'>
          <AlertIcon />
          <Box>
            <AlertTitle>{text} has been Invited!</AlertTitle>
            <AlertDescription>
              Please wait for your friend to accept the event invitation.
            </AlertDescription>
          </Box>
          <CloseButton
            alignSelf='flex-start'
            position='relative'
            right={-1}
            top={-1}
            onClick={improvedClose}
          />
        </Alert>
        :
        <Alert status='error'>
          <AlertIcon />
          <Box>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {text} has already been sent an invite.
            </AlertDescription>
          </Box>
          <CloseButton
            alignSelf='flex-start'
            position='relative'
            right={-1}
            top={-1}
            onClick={improvedClose}
          />
        </Alert>
      :
      <Alert status='error'>
        <AlertIcon />
        <Box>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {text} is already part of the event. 
          </AlertDescription>
        </Box>
        <CloseButton
          alignSelf='flex-start'
          position='relative'
          right={-1}
          top={-1}
          onClick={improvedClose}
        />
      </Alert>
    ) : (
      <Button size='lg' onClick={() => onClickJioFriend(text)} >Enter</Button>
      // <Button onClick={onOpen}>Show Alert</Button>
    )
  }

  function RightBottomPage() {
    // make it such that onClick -> the screen refreshes.
    return ( MeInEvent() ?
      // if you are in the event, show a leave button -> can invite friends to the event, if they are inside of the event, then alert showing error will show, else, show invited
      <Stack spacing={4}>
        <Heading as='h4' size='md'>
          Invite Friends to event
        </Heading>
        <InputGroup>
          <Input variant='filled' placeholder='Invite Friends' size='lg' value={text} onChange={e => onChangeHandler(e.target.value)}  /* className="col-md-12 input" */ />
          <JoinEventButton />
          {/* <Button size='lg' onClick={() => onClickJioFriend(text)} >Enter</Button> */}
        </InputGroup>
        {suggestions && suggestions.map((suggestion, index) => 
          <option key={index} value={suggestion} onClick={() => onSuggestHandler(suggestion)}>{suggestion.player_name}</option> // value here doesnt rly matter
          // <div key={index} value={suggestion} onClick={() => onSuggestHandler(suggestion.player_name)}>{suggestion.player_name}</div>
        )}

        <Flex align="bottom" justify="right">
          <Button colorScheme='red' variant='outline' size='lg' onClick={() => DeleteFromEvent(myId)}>Leave</Button>
        </Flex>
      </Stack>
      : 
      // else, show a join button instead. 
      <Flex align="center" justify="center">
        <Button colorScheme='blue' variant='solid' size='lg' onClick={() => AddToEvent(myId)}>Join</Button>
      </Flex>
    )
  }

  return (
    <div>
      <NavBar />
      <Container maxW={'5xl'} py={8} px={4}>
      <SimpleGrid columns={{ base: 2, md: 2 }} spacing={10}>
        <Stack spacing={4}>
          <HStack>
            <Text
              textTransform={'uppercase'}
              color={'blue.200'}
              fontWeight={600}
              fontSize={'sm'}
              bg={useColorModeValue('blue.50', 'blue.900')}
              p={2}
              alignSelf={'flex-start'}
              rounded={'md'}>
              {myEventData.activity}
            </Text>
            <SportIcon what={myEventData.activity} />
          </HStack>

          <Heading>
            {courtData.court_name}
          </Heading>
          <Text color={'gray.500'} fontSize={'lg'}>
            {courtData.court_region} side event happening on {date}
          </Text>
          <Flex align="center" justify="center">
            <Avatar src={organiserData.player_image} size='xl'/>
            <Box ml='5'>
              <Text fontWeight='bold' fontSize='xl'>
              {organiserData.player_name}
                <Badge ml='1' colorScheme='purple'>
                  Organiser
                </Badge>
              </Text>
              <Text fontSize='sm'>{organiserData.player_level}</Text>
            </Box>
          </Flex>
          {/* <HStack>
            <Avatar src={organiserData.player_image} size='2xl'>
             <AvatarBadge boxSize='1.25em' bg='green.500' /> 
            </Avatar>
            <VStack spacing={-1}>
              <Text>{organiserData.player_name}</Text>
                <Text>level : {organiserData.player_level}</Text>
            </VStack>
          </HStack> */}
          <Stack
            spacing={4}
            divider={
              <StackDivider
                borderColor={useColorModeValue('gray.100', 'gray.700')}
              />
            }>
              {/* include your attendees here possibly.  */}
          </Stack>
        </Stack>
        <Flex>
          <Image
            rounded={'md'}
            alt={'feature image'}
            src={
              courtData.court_image
            }
            objectFit={'cover'}
            onClick={async (event) => {
              try {
              await navigate("/court/" + courtData.court_id); // click on court image -> go to court page.
              } catch (error) {
              console.log(error);
              }
            }}/>
          />
        </Flex>
        {/* below here can add participants and the add button respectively */}
        <ViewParticipants />

          <RightBottomPage />

      </SimpleGrid>
    </Container>
    </div>
  )
}
