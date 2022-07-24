import {React, useState, useEffect,} from 'react'
import ShowSport from "../components/SportSVG";
import {
    collection,
    getDoc,
    doc,
    query,
    where,
    getDocs,
    addDoc,
  } from "firebase/firestore";
import {
    Box,
    Container,
    Stack,
    Text,
    Image,
    Flex,
    VStack,
    Button,
    SimpleGrid,
    StackDivider,
    useColorModeValue,
    List,
    ListItem,
    Select,
    Input,
    InputGroup,
    FormLabel,
    FormControl,
    InputRightElement,
    HStack,
    FormHelperText,
    FormErrorMessage,
    NumberInput,
    NumberIncrementStepper,
    NumberDecrementStepper,
    NumberInputField,
    NumberInputStepper,
    Avatar,
    Badge,
    useDisclosure,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    CloseButton,
    Alert,
  } from '@chakra-ui/react';
  // import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { MdCheckCircle, MdOutlineGroups, MdClear, } from 'react-icons/md';

import NavBar from "../components/NavBar";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
// import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
require('react-datepicker/dist/react-datepicker.css'); // missing css dependency that is not on the website. 

export default function TestPage() {
    // const [value, setValue] = useState("");
    // const handleChange = (event) => {setValue(event.target.value);}

    const [courtVal, setCourtVal] = useState(''); // the court object chosen!
    const [sport, setSport] = useState("");
    const [levelProf, setLevel] = useState("");
    const [limit, setLimit] = useState(0);
    const [date, setDate] = useState(new Date()); // has to be a date object... compare with endDate. 
    const [endDate, setEndDate] = useState(new Date());

    const [inviteList, setInviteList] = useState([]); // Since you are the creator of the event, you can just add friends to the event when creating. -> we dont know the eid yet anyways...
    const [myFriends, setMyFriends] = useState([]); // query every single one of your friends

    const [allCourts, setAllCourts] = useState([]); // query every court doc then search from the query. 

    const { currentUser } = useAuth();
    const myId = currentUser.uid;
    const navigate = useNavigate();

    const getUserDetails = async (user_id) => {
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

    useEffect(() => {
        const getFriendDoc = async () => {
          const userDocRef = doc(collection(db, "users"), myId); 
          const userData = await getDoc(userDocRef);
          if (userData.exists()) {
            const tempArray = userData.data().friends.map((person) => getUserDetails(person));
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

    const [clashEvent, setClashEvent] = useState('');

    useEffect(() => {
        const getEventsAtCourt = async () => {
          // const courtEvents = query(collection(db, "events"), where("date", "<=", endDate), where("end_date", ">=", date), where("court_id", "==", courtVal.court_id));
          const courtEvents = query(collection(db, "events"), where("court_id", "==", courtVal.court_id));
          try {
            const courtEventsData = await getDocs(courtEvents);
            console.log("courtEventsData = ", courtEventsData); // getDocs returns a weird object
            if (courtEventsData.empty) {
                setClashEvent('');
            } else {
                courtEventsData.forEach((doc) => {
                    console.log(doc.id, " => ", doc.data());
                    if (doc.date <= endDate && doc.end_date >= date) {
                        // prevent clash logic, you can clash with multiple events, just figure it out slowly...
                        setClashEvent({
                            start_time: doc.date,
                            end_time: doc.end_date,
                            event_organiser: doc.organiser,
                            event_activity: doc.activity,
                        })
                    }
                  });
            }
            } catch (error) {
                console.log(error);
            }
        };
        getEventsAtCourt();
      }, [courtVal, date, endDate]); // everyTime date changes, you will need to check. 

        
    /* async function createEvent() {
        try {
            const finalList = inviteList.map((user_obj) => user_obj.player_id); // converts all the user objects into an Array of UID
            await addDoc(collection(db, "events"), { activity: sport, attendees: [myId].concat(finalList), court_id: courtVal.court_id, date: date, end_date: endDate, organiser: currentUser.uid, event_limit: limit });
            // navigate("/"); only navigate back to the dashboard once the alert x is clicked. 
            // invite list is only for inviting everyone to attend, based on their 
        } catch (error) {
            // return the error alert from here! 
            console.log(error);
        }
    } */

    function OrganiseEventButton() {
        const {
            isOpen: isVisible,
            onClose,
            onOpen,
          } = useDisclosure({ defaultIsOpen: false })


        /* function subtractOneMinute() {
            const dateCopy = new Date(endDate.getTime()); 
            dateCopy.setTime(dateCopy.getTime() - 60 * 1000);
            return dateCopy;
            // save as 23:59 -> so the other person can just book at 00:00
        } */

        let formNotFilled = (courtVal === '' || sport === "" || levelProf === "" || date === endDate || limit === 0); // should be able to use const

        const createEvent = async () => {
            try {
                const convertedArray = inviteList.map((user_obj) => user_obj.player_id); // converts all the user objects into an Array of UID
                const whyINotInMyOwnList = [myId].concat(convertedArray);
                await addDoc(collection(db, "events"), { activity: sport, attendees: whyINotInMyOwnList, court_id: courtVal.court_id, date: date, end_date: endDate, organiser: currentUser.uid, event_limit: limit });
            } catch (error) {
                console.log(error);
            }
        }

        const myButtonCallWhat = () => {
            if (!formNotFilled && clashEvent === '') {
                createEvent();
            }
            onOpen(); // called after?
        }

        return isVisible ? (
            (formNotFilled) ? (
                <Alert status='error'>
                    <AlertIcon />
                    <Box>
                    <AlertTitle>Incomplete details.</AlertTitle>
                    <AlertDescription>
                        you are not done setting up the event.
                    </AlertDescription>
                    </Box>
                    <CloseButton
                    alignSelf='flex-start'
                    position='relative'
                    right={-1}
                    top={-1}
                    onClick={onClose}
                    />
                </Alert>
            ) : ( 
                (clashEvent !== '') ? (
                    <Alert status='error'>
                        <AlertIcon />
                        <Box>
                        <AlertTitle>Event clash.</AlertTitle>
                        <AlertDescription>
                            There is {clashEvent.event_activity} happening at the same venue from {clashEvent.start_time} to {clashEvent.end_time}
                        </AlertDescription>
                        </Box>
                        <CloseButton
                        alignSelf='flex-start'
                        position='relative'
                        right={-1}
                        top={-1}
                        onClick={onClose}
                        />
                    </Alert>
                ) : (
                    // when all goes well
                    <Alert status='success'>
                        <AlertIcon />
                        <Box>
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>
                            Your Event has been created.
                        </AlertDescription>
                        </Box>
                        <CloseButton
                        alignSelf='flex-start'
                        position='relative'
                        right={-1}
                        top={-1}
                        onClick={() => {navigate("/")}} // cannot just call function -> immediate navigate. 
                        />
                    </Alert>
                )
            )
        ) : (
            <Button
                rounded={'none'}
                w={'full'}
                mt={8}
                size={'lg'}
                py={'7'}
                // bg={useColorModeValue('gray.900', 'gray.50')}
                // color={useColorModeValue('white', 'gray.900')}
                textTransform={'uppercase'}
                _hover={{
                transform: 'translateY(2px)',
                boxShadow: 'lg',
                }}
                leftIcon={<MdCheckCircle />} onClick={() => {myButtonCallWhat()}}>
                Organise Event
            </Button>
        )
    }

    /* function StyleMyButton() {
        return (
            <Button
                    rounded={'none'}
                    w={'full'}
                    mt={8}
                    size={'lg'}
                    py={'7'}
                    bg={useColorModeValue('gray.900', 'gray.50')}
                    color={useColorModeValue('white', 'gray.900')}
                    textTransform={'uppercase'}
                    _hover={{
                    transform: 'translateY(2px)',
                    boxShadow: 'lg',
                    }}
                    leftIcon={<MdCheckCircle />} onClick={onOpen}>
                    Organise Event
                </Button>
        ) // cant separate out the button because the variables are shared with the alert closely.
    } */

    // 1: query court as we type: onChange
    /* const getCourt = async (court_id) => {
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
      } */

      useEffect(() => {
        const getAllCourtDoc = async () => {
          const courtData = await getDocs(collection(db, "courts"));
          // console.log("courtData = ", courtData.docs);
            /* setAllCourts(courtData.docs.map((doc) => ({ court_id: doc.id, 
                activity: doc.data().activity, 
                court_image: doc.data().court_image, 
                gmaps: doc.data().gmaps, 
                court_name: doc.data().court_name, 
                region: doc.data().region,
                }))); */
                setAllCourts(courtData.docs.map((doc) => ({ court_id: doc.id, 
                    ...doc.data(),
                    })));
            // courtData.docs.forEach((doc) => (console.log("a doc = ", doc.data())));
        };
        getAllCourtDoc();
      }, []); // only runs once during the rendering of the page initially. 
      // console.log("all courts data = ", allCourts);

      const [courtNameInput, setCourtNameInput] = useState('');
      const [courtSuggestions, setCourtSuggestions] = useState([]); 
    
      const onCourtSuggestHandler = (court_obj) => {
        setCourtNameInput(court_obj.court_name); // set the char in input to the value of the option selected
        setCourtVal(court_obj); // loads the court object that you have selected in your options.
        setCourtSuggestions([]); // to remove the suggestions after selection
      }
    
      const onCourtChangeHandler = (text) => {
        let matches = [];
        if (text.length > 0) {
          matches = allCourts.filter(court => {
            const regex = new RegExp(`${text}`, "gi");
            return court.court_name.match(regex);
          })
        }
        // console.log("the matches = ", matches);
        setCourtSuggestions(matches); // an array of court objects. 
        setCourtNameInput(text);
      }

    function SelectCourt() {
        const withoutSuggestion = (courtName) => {
            const matchArray = allCourts.filter((court) => court.court_name === courtName);
            return (matchArray.length === 0);
        }

        const isError = (withoutSuggestion(courtNameInput) && (courtNameInput !== '')); // even though isError is a const, it will re-evaluate whenever useState courtNameInput changes.

        return (
            <Container>
                <FormControl isRequired size="lg">
                    <FormLabel htmlFor="Court">Select Court</FormLabel>
                    <InputGroup size="lg">
                        <Input
                        id="court_id"
                        variant="filled"
                        placeholder="Enter Venue Name"
                        // type="number"
                        value={courtNameInput}
                        onChange={e => onCourtChangeHandler(e.target.value)}  
                        />
                        <InputRightElement width="4.5rem">
                            <Button h="1.75rem" size="sm" rightIcon={<MdClear />} onClick={() => {setCourtNameInput('');}} />
                        </InputRightElement>
                    </InputGroup>
                    {!isError ? (
                        <FormHelperText>
                        Enter the name of the venue in full if you do not use values from the autosuggestions.
                        </FormHelperText>
                    ) : (
                        <FormErrorMessage>The venue requested does not exist.</FormErrorMessage>
                    )}
                </FormControl>
                {courtSuggestions && courtSuggestions.map((suggestion, index) => 
                    <option key={index} value={suggestion} onClick={() => onCourtSuggestHandler(suggestion)}>{suggestion.court_name}</option> // show court name but use the court object.
                )}
            </Container>
        )
    }

    function SelectSport() {
        return (
            <Select
                isRequired
                size="lg"
                //borderColor="blue"
                placeholder='Select option'
                // defaultValue="basketball"
                onChange={(event) => {setSport(event.target.value)}}
              >               
                <option selected hidden disabled value="">Choose a sport</option>
                <option value="basketball">
                  basketball 
                </option>
                <option value="volleyball">
                  volleyball
                </option>
                <option value="football">
                  football
                </option>
                <option value="badminton">badminton</option>
                <option value="tennis">
                  tennis
                </option>
                <option value="frisbee">
                  frisbee
                </option>
                <option value="table tennis">table tennis</option>
                <option value="tchoukball">
                  tchoukball
                </option>
                <option value="handball">
                  Handball
                </option>
              </Select>
        )
    }

    function SelectLevel() {
        return (
            <Select
                isRequired
                size="lg"
                placeholder="Select Proficiency Level"
                onChange={(event) => {setLevel(event.target.value)}}
            >
                <option selected hidden disabled value="">Choose level of play</option>
                <option value="beginner">beginner </option>
                <option value="intermediate">intermediate </option>
                <option value="advanced">advanced </option>
            </Select>
        )
    }

    function addHours(numOfHours) {
        const dateCopy = new Date(date.getTime()); // copy from useState date, but if hours is called first, gg.
      
        dateCopy.setTime(dateCopy.getTime() + numOfHours * 60 * 60 * 1000);
      
        return dateCopy;
    }

    const [durationVariable, setDurationVariable] = useState(0);

    function SelectDuration() {
        const increaseHours = (numOfHours) => {
            setEndDate(addHours(numOfHours));
            setDurationVariable(numOfHours);
        }
        return (
            <NumberInput size='lg' maxW={24} 
                defaultValue={0} min={0} max={6} step={0.5} precision={1}
                value={durationVariable}
                onChange={(numOfHours) => {increaseHours(numOfHours)}}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
        )
    }

    function SetEventLimit() {
        return (
            <NumberInput size='lg' maxW={24} 
                defaultValue={0} min={0}
                value={limit}
                onChange={(numOfPeople) => {setLimit(numOfPeople)}}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
        )
    }

    const [text, setText] = useState('');
    const [suggestions, setSuggestions] = useState([]); // wtf is initialState? 
    const [holdingCell, setHoldingCell] = useState(''); // keep friend in here to add to list. 
  
    const onSuggestHandler = (text) => {
      setText(text.player_name);
      setHoldingCell(text);
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

    function InviteFriendSection() {
        const isInvited = (friend_name) => {
            const tempArray = inviteList.filter((aFriend) => aFriend.player_name === friend_name); // if yes, means added already.
            return (tempArray.length > 0);
        }

        const isFriend = (friend_name) => {
            const tempArray = myFriends.filter((aFriend) => aFriend.player_name === friend_name); 
            return (tempArray.length > 0);
        }

        const clickToAdd = () => {
            if (!isInvited(text) && isFriend(text)) {
                setInviteList(inviteList => [...inviteList, holdingCell]);
                setText("");
            }
        }
        
        return (
            <FormControl>
                <InputGroup>
                <Input variant='filled' placeholder='Invite Friends' size='lg' value={text} onChange={e => onChangeHandler(e.target.value)}  /* className="col-md-12 input" */ />
                    <InputRightElement width="4.5rem">
                        <Button
                            h="1.75rem"
                            size="sm"
                            onClick={() => {
                                clickToAdd();
                            }}
                        >
                            Enter
                        </Button>
                    </InputRightElement>
                {/* <Button size='lg' onClick={() => onClickJioFriend(text)} >Enter</Button> */}
                </InputGroup>
                {((isFriend(text)) ? ( (isInvited(text)) ? (
                        <FormErrorMessage>User already added.</FormErrorMessage>
                    ) : (
                        <FormHelperText>
                        Enter to add friend to event.
                        </FormHelperText>
                    )
                ) : (
                    <FormErrorMessage>Invalid user</FormErrorMessage>
                )
                )}
                {suggestions && suggestions.map((suggestion) => 
                <option key={suggestion.player_id} value={suggestion} onClick={() => onSuggestHandler(suggestion)}>{suggestion.player_name}</option> // value here doesnt rly matter
                )}
            </FormControl>
        )
    }

    const fixEventTime = (date_obj) => {
        let theHours = date_obj.getHours().toString();
        let theMinutes = date_obj.getMinutes().toString();
        while (theHours.length < 2) {
            theHours = "0" + theHours;
          }
        while (theMinutes.length < 2) {
            theMinutes = "0" + theMinutes;
        }
        return (
            theHours + ":" + theMinutes
        )
    }

    return (
        <div>
            <NavBar />
            <Container maxW={'7xl'}>
            {/* <Heading
                    lineHeight={1.1}
                    fontWeight={600}
                    fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
                    Event Creation Page
                </Heading> */}
            <SimpleGrid
                columns={{ base: 1, lg: 1 }}
                spacing={{ base: 8, md: 10 }}
                py={{ base: 18, md: 2 }}>
                <Flex>
                <Image
                    rounded={'md'}
                    alt={'product image'}
                    src={courtVal.court_image}
                    fallbackSrc='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWNagz8BRnuNuWiu3jDli_q7Lvmn7EEesUtQ&usqp=CAU'
                    fit={'cover'}
                    align={'center'}
                    w={'100%'}
                    h={{ base: '100%', sm: '400px', lg: '500px' }}
                />
                </Flex>
                <Stack spacing={{ base: 6, md: 10 }}>

                <Box as={'header'}>
                    <Text
                    color={useColorModeValue('gray.900', 'gray.400')}
                    fontWeight={300}
                    fontSize={'2xl'}>
                    Venue selected: {courtVal.court_name}
                    </Text>
                    <SelectCourt /> 
                </Box>
        
                <Stack
                    spacing={{ base: 4, sm: 6 }}
                    direction={'column'}
                    divider={
                    <StackDivider
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                    />
                    }>
                    <VStack spacing={{ base: 4, sm: 6 }}>
                    </VStack>

                    <Box>
                    <Text
                        fontSize={{ base: '16px', lg: '18px' }}
                        color={useColorModeValue('yellow.500', 'yellow.300')}
                        fontWeight={'500'}
                        textTransform={'uppercase'}
                        mb={'4'}>
                        Set event time
                    </Text>
        
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                        <List spacing={2}>
                        <HStack> 
                            <Text>Time: </Text>
                            <DatePicker selected={date} showTimeSelect dateFormat="Pp" onChange={date => setDate(date)} />  
                        </HStack>
                        <HStack> 
                            <Text>Duration in hours: </Text>
                            <SelectDuration />  
                        </HStack>
                        </List>
                        {/* getMonth() is off by 1 month... */}
                        {(endDate.getTime() > date.getTime()) ? (
                            <List spacing={2}>
                                <ListItem><HStack><Text>Date: {date.getDate()} / {date.getMonth() + 1} / {date.getFullYear()} </Text></HStack></ListItem> 
                                <ListItem><HStack><Text>Start: {fixEventTime(date)} </Text></HStack></ListItem>
                                {/* can fix getHours showing 1.0 instead of 01:00 as time.  */}
                                <ListItem>End: {fixEventTime(endDate)} </ListItem>
                            </List>
                        ) : (
                            <List spacing={2}>
                                <ListItem><Text>Date: ... </Text></ListItem>
                                <ListItem><HStack><Text>Start: ... </Text></HStack></ListItem>
                                <ListItem>End: ... </ListItem>
                            </List>
                        )}
                        
                    </SimpleGrid>
                    </Box>

                    <Box>
                    <Text
                        fontSize={{ base: '16px', lg: '18px' }}
                        color={useColorModeValue('yellow.500', 'yellow.300')}
                        fontWeight={'500'}
                        textTransform={'uppercase'}
                        mb={'4'}>
                        Choose Activity and proficiency level
                    </Text>
        
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}> 
                        <List spacing={2}>
                        <ListItem><HStack><Text>Activity Selected: </Text> <Text as='b'> {sport} </Text> <ShowSport what={sport} /></HStack></ListItem>
                        <SelectSport />
                        </List>
                        <List spacing={2}>
                        <ListItem>Proficiency Level Selected: {levelProf}</ListItem>
                        <SelectLevel />
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
                        Invite Friends
                    </Text>
        
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                        <List spacing={2}>
                        {/* for loop tru ur invitee array to invite your friends */}
                        <ListItem>
                            <InviteFriendSection />
                        </ListItem>
                        <ListItem>
                            <HStack>
                                <Text fontSize='lg'>Preferred number of participants: </Text>
                                <SetEventLimit />
                            </HStack>
                        </ListItem>
                        </List>
                    
                        <List spacing={2}>
                        <ListItem>
                            <Text
                                fontSize={{ base: '16px', lg: '18px' }}
                                color={useColorModeValue('yellow.500', 'yellow.300')}
                                fontWeight={'500'}
                                textTransform={'uppercase'}
                                mb={'4'}>
                                Invite List:
                            </Text>
                        </ListItem>
                            {(inviteList.length === 0) ? (
                                    <Text> No one is invited yet </Text>
                                ) : (
                                inviteList.map((aFriend) => {
                                    return (
                                        <Flex key={aFriend.player_id}>
                                            <Avatar src={aFriend.player_image} />
                                            <Box ml='3'>
                                                <Text fontWeight='bold'>
                                                    {aFriend.player_name}
                                                <Badge ml='1' colorScheme='orange'>
                                                    {aFriend.player_level}
                                                </Badge>
                                                </Text>
                                                <Text fontSize='sm'>Friends</Text>
                                            </Box>
                                        </Flex>
                                    )})
                                )}
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
                        Event Summary
                    </Text>
        
                    <List spacing={2}>
                        <ListItem>
                        <Text as={'span'} fontWeight={'bold'}>
                            Venue:
                        </Text>{' '}
                        {courtVal.court_name}
                        </ListItem>
                        <ListItem>
                            <HStack>
                            <Text as={'span'} fontWeight={'bold'}>
                                Activity: {sport}
                            </Text>{' '}
                            <ShowSport what={sport} />
                            </HStack>
                        </ListItem>
                        <ListItem>
                        <Text as={'span'} fontWeight={'bold'}>
                            Time: {String(date)}
                        </Text>{' '}
                        </ListItem>
                        <ListItem>
                        <Text as={'span'} fontWeight={'bold'}>
                            Event size: 
                        </Text>{' '}
                            {limit}
                        </ListItem>
                    </List>
                    </Box>
                </Stack>
        
                <OrganiseEventButton /> 
        
                <Stack direction="row" alignItems="center" justifyContent={'center'}>
                    <MdOutlineGroups />
                    <Text>Brought to you by SmartJio</Text>
                </Stack>
                </Stack>
            </SimpleGrid>
            </Container>
        </div>
      );
    }
