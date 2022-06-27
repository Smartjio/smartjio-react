import { React, useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { db } from "../firebase.js";
import { useAuth } from "../contexts/AuthContext";

import {
    // MdEventAvailable,
    MdCheckCircle,
  } from "react-icons/md";

import {
  useDisclosure,
  Alert,
  Center,
  AlertIcon,
  Box,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Text,
  Heading,
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  VStack,
  Container,
  StackDivider,
} from "@chakra-ui/react";

import {
    collection,
    addDoc,
    doc,
    where,
    query,
  } from "firebase/firestore";

function SuccessCreation() {
    const {
      isOpen: isVisible,
      onClose,
      onOpen,
    } = useDisclosure({ defaultIsOpen: true })
  
    return isVisible ? (
      <Alert status='success'>
        <AlertIcon />
        <Box>
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Event is set! 
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
      <Button onClick={onOpen}>Show Event Creation Result</Button>
    )
  }

  function FailureCreation() {
    const {
      isOpen: isVisible,
      onClose,
      onOpen,
    } = useDisclosure({ defaultIsOpen: true })
  
    return isVisible ? (
      <Alert status='failure'>
        <AlertIcon />
        <Box>
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>
            Please choose a different timing or Sport!
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
      <Button onClick={onOpen}>Show Alert</Button>
    )
  }

export default function EventCreation() {
    const [value, setValue] = useState("");
    const handleChange = (event) => {setValue(event.target.value);}

  const [courtVal, setCourtVal] = useState(0);
  const [sport, setSport] = useState("");
  const [levelProf, setLevel] = useState("");
  const [eventTime, setEventTime] = useState("");

  let tempArray = [];
  const { currentUser } = useAuth();

  /* console.log(courtVal);
  console.log(sport);
  console.log(levelProf);
  console.log(eventTime); */

  // query to check against the event that is to be created -> call either success or failure alert. 

  async function createEvent() {
    // onClick => calls this function that addDoc into firebase => dunnid to worry about clashes just yet. 
    try {
        await addDoc(collection(db, "events"), { activity: sport, attendees: tempArray, court_id: courtVal, date: new Date(), organiser: currentUser.uid, time: eventTime });
    } catch (error) {
        // return the error alert from here! 
        console.log(error);
    }
  }

  return (
    <div>
      <NavBar />
      EventCreation Under Construction
      <VStack
          divider={<StackDivider borderColor="gray.200" />}
          spacing={100}
          align="stretch"
        >
    <Container>
    <Center>
        <Text>Postal Code numbers only!</Text>
        <Heading fontSize="2xl">
          {" "}
          Court selected: {" "}
          {courtVal === 0 ? " " : String(courtVal)}{" "}
        </Heading>
      </Center>
      <Container maxW="md">
        <FormControl isRequired size="lg">
          <FormLabel htmlFor="Court">Select Court</FormLabel>
          <InputGroup size="lg">
            <Input
              id="court_id"
              variant="filled"
              placeholder="Enter Court PostalCode"
              type="number"
              value={value}
              onChange={handleChange}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => {
                    setCourtVal(value);
                }}
              >
                Enter
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
      </Container>
    </Container>
      



      <Container maxW="lg">
          <Center>
            <VStack>
              <Heading fontSize="4xl">selected: {sport}</Heading>
              <select
                isRequired
                size="lg"
                borderColor="blue"
                placeholder='Select option'
                // defaultValue="basketball"
                onChange={(event) => {setSport(event.target.value)}}
              >               
                <option selected hidden disabled value="">Choose a sport</option>
                <option value="basketball">
                  basketball {/* <MdOutlineSportsBasketball /> */}
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
                  dog sport
                </option>
                <option value="table tennis">table tennis</option>
                <option value="tchoukball">
                  tchoukball
                </option>
                <option value="handball">
                  Handball
                </option>
              </select>
            </VStack>
          </Center>
        </Container>
        {/* onSubmit => for the form, all of the values should be colated.  */}



        <Container maxW="md">
          <Center>
            <VStack>
              <Heading fontSize="2xl">Proficiency level: {levelProf}</Heading>
              <select
                isRequired
                size="lg"
                placeholder="Select Proficiency Level"
                onChange={(event) => {setLevel(event.target.value)}}
              >
                <option selected hidden disabled value="">Choose level of play</option>
                <option value="beginner">beginner </option>
                <option value="intermediate">intermediate </option>
                <option value="advanced">advanced </option>
              </select>
            </VStack>
          </Center>
        </Container>

        <Container maxW="md">
          <Center>
            <VStack>
              <Heading fontSize="2xl">Time selected: {eventTime}</Heading>
              <select
                isRequired
                size="lg"
                placeholder="Select timings"
                onChange={(event) => {setEventTime(event.target.value)}}
              >
                <option selected hidden disabled value="">Choose timings for event</option>
                <option value="morning">Morning </option>
                <option value="afternoon">Afternoon </option>
                <option value="evening">Evening </option>
              </select>
            </VStack>
          </Center>
        </Container>

        <Center>
            <VStack>
            <SuccessCreation />
        <Box alignItems='center'>
        <Button colorScheme='yellow' leftIcon={<MdCheckCircle />} onClick={createEvent}> Organise this event! </Button>
        </Box>
            </VStack>
        </Center>

        <Box display='flex' alignItems='center' >Spacing at end</Box>

        </VStack>
    </div>
  );
}


//   function CreationConfirmation() {
//     /* handles the form logic within the submit button. */
//     const {
//         isOpen: isVisible,
//         onClose,
//         onOpen,
//       } = useDisclosure(/* { defaultIsOpen: true } */);
  
//       return isVisible ? (
//   /*         console.log(courtPostalCode)
//           console.log(sport)
//           console.log(levelProf)
//           console.log(invitees) */
  
//       <Alert
//           status="success"
//           variant="subtle"
//           flexDirection="column"
//           alignItems="center"
//           justifyContent="center"
//           textAlign="center"
//           height="150px"
//       >
//           <Center>
//           <AlertIcon boxSize="40px" mr={0} />
//           <Box>
//               <AlertTitle>Success!</AlertTitle>
//               <AlertDescription>
//               Your Jio was successfully created!
//               </AlertDescription>
//           </Box>
//           <CloseButton
//               alignSelf="flex-start"
//               position="relative"
//               right={-1}
//               top={-1}
//               onClick={onClose}
//           />
//           </Center>
//       </Alert>
  
//       ) : (
//         <Center p={8}>
//           <Button
//             w={"full"}
//             maxW={"md"}
//             colorScheme={"messenger"}
//             leftIcon={<MdEventAvailable />}
//             onClick={onOpen}
//             /* runs another function to check validity before onOpen can be called. 
//                 there are two alerts -> one successful, the other unsuccessful. */
//           >
//             <Center>
//               <Text>Make this a JIO</Text>
//             </Center>
//           </Button>
//         </Center>
//       );
//     } 

/*   function InviteFriends() {
    // first query your friends
    // then make cards? or easier just make a box for them to choose usernames from.
    const [value, setValue] = React.useState('')
    const handleChange = (event) => setValue(event.target.value)

    return (
      <div>
        <Center>
        <text mb="8px">{value}</text>
        <List spacing={3}>
            {invitees.map((person) => {
                return (
                    <ListItem>
                        <ListIcon as={MdCheckCircle} color='green.500' />
                        {person}
                    </ListItem>
                )
                })}
        </List>

        <FormControl size="lg">
            <FormLabel htmlFor="Court">Select Invitees</FormLabel>
            <InputGroup size='md'>
    <Input
        // will need to clear the input after submission. 
        placeholder="John Doe"
        value={value}
        onChange={handleChange} 
        // let value take on the value first, then on submit, transfers to invitees[]
      />
      <InputRightElement width='4.5rem'>
        <Button h='1.75rem' size='sm' onClick={(event) => {setInvitees(invitees.push(value))}}>
          Invite
        </Button>
        </InputRightElement>
        </InputGroup>
        </FormControl>
        </Center>
      </div>
    );
  } */
