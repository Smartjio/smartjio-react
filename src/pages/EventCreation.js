import React, { useState, useEffect, HTMLAttributes } from "react";
import {
  MdOutlineSportsBasketball,
  MdOutlineSportsBaseball,
  MdOutlineSportsVolleyball,
  MdOutlineSportsTennis,
  MdOutlineSportsHandball,
  MdOutlineSportsSoccer,
  MdOutlineThumbDownAlt,
  MdEventAvailable,
  MdCheckCircle,
} from "react-icons/md";

import Nav from "../components/NavBar";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  HStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  VisuallyHidden,
  List,
  ListItem,
  Center,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Select,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  useDisclosure,
  InputRightElement,
  InputLeftElement,
  InputGroup,
  ListIcon,
} from "@chakra-ui/react";

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  where,
  query,
} from "firebase/firestore";

import { db } from "../firebase.js";
// import Avatar from "../components/AvatarRipple"; // choose friends from their avatar and user_name.
import { useAuth } from "../contexts/AuthContext";
import { async } from "@firebase/util";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker"; // calendar component
import calendarComponent from "../components/date-picker";

const NavBar = (
  <Nav />
); 

export default function EventCreation() {
  const navigate = useNavigate(); // use nav to go from page to another page.
  const { currentUser, logout } = useAuth();
  const [courtPostalCode, setCourt] = useState(0);
  const [sport, setSport] = useState("");
  const [levelProf, setLevel] = useState("");
  const [eventTime, setEventTime] = useState(""); // an object map. {startTime: 0, endTime: 0}

  // const timeFrames = ["morning", "afternoon", "evening"];

  // const [invitees, setInvitees] = useState([]); // an array of the string of usernames should be queried. -> checked against.
  // retrieve array of friends and courts -> compare to see if court id is in the db. 
  console.log(courtPostalCode);
  console.log(sport);
  console.log(levelProf);

  const alertContent = [{label: "Success!", content: "Your Jio was successfully created!"}, {label: "Error", content:"Court chosen does not exist"}, 
    {label:"Error", content:"There is already an event happening at the same time"}]
  const alertText = []

  const createEvent = async => {

  }

// try creating an event first, once that is done, we can try querying the db for the court and the date to check if the court is already booked. 

  function CreationConfirmation() {
    /* handles the form logic within the submit button. */
    const {
      isOpen: isVisible,
      onClose,
      onOpen,
    } = useDisclosure(/* { defaultIsOpen: true } */);

    return isVisible ? (
/*         console.log(courtPostalCode)
        console.log(sport)
        console.log(levelProf)
        console.log(invitees) */

    <Alert
        status="success"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="150px"
    >
        <Center>
        <AlertIcon boxSize="40px" mr={0} />
        <Box>
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
            Your Jio was successfully created!
            </AlertDescription>
        </Box>
        <CloseButton
            alignSelf="flex-start"
            position="relative"
            right={-1}
            top={-1}
            onClick={onClose}
        />
        </Center>
    </Alert>

    ) : (
      <Center p={8}>
        <Button
          w={"full"}
          maxW={"md"}
          colorScheme={"messenger"}
          leftIcon={<MdEventAvailable />}
          onClick={onOpen}
          /* runs another function to check validity before onOpen can be called. 
              there are two alerts -> one successful, the other unsuccessful. */
        >
          <Center>
            <Text>Make this a JIO</Text>
          </Center>
        </Button>
      </Center>
    );
    {
      /* returns an pop-up saying either the Event creation is a success or a failure depending on the schedule of the day of the specific court */
    }
  }

  function SelectCourt() {
    const [value, setValue] = React.useState("");
    const handleChange = (event) => setValue(event.target.value);

    return (
      <div>
        <Center>
          <Heading fontSize='2xl'> Court selected: {courtPostalCode === 0 ? " " : String(courtPostalCode)} </Heading>
        </Center>
        <Container maxW="md">
          <FormControl isRequired size="lg">
            <FormLabel htmlFor="Court">Select Court</FormLabel>
            <InputGroup size='lg'>
            <Input
              id="court_id"
              variant="filled"
              placeholder="Enter Court Name"
              type="number"
              value={value}
              onChange={handleChange}
            />
            <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={() => {setCourt(Number(value))}}>
                Enter
            </Button>
            </InputRightElement>
            </InputGroup>
          </FormControl>
        </Container>
      </div>
    );
  }

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

  function SelectSport() {
    /* variable types: Global, Function, Block */
    // const [value, setValue] = React.useState("");
    // const handleChange = (event) => setValue(event.target.value);
    return (
      <div>
        {/* <text>how to glean values off a select component?</text> */}
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
                  basketball <MdOutlineSportsBasketball />
                </option>
                <option value="volleyball">
                  volleyball <MdOutlineSportsVolleyball />
                </option>
                <option value="football">
                  football <MdOutlineSportsSoccer />
                </option>
                <option value="badminton">badminton</option>
                <option value="tennis">
                  tennis <MdOutlineSportsTennis />
                </option>
                <option value="frisbee">
                  dog sport <MdOutlineThumbDownAlt />
                </option>
                <option value="table tennis">table tennis</option>
                <option value="tchoukball">
                  tchoukball <MdOutlineSportsHandball />
                </option>
                <option value="handball">
                  Handball <MdOutlineSportsHandball />
                </option>
              </select>
            </VStack>
          </Center>
        </Container>
        {/* onSubmit => for the form, all of the values should be colated.  */}
      </div>
    );
  }

  function SelectProficiency() {
    return (
      <div>
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
      </div>
    );
  }

  const [startDate, setStartDate] = useState(
    new Date()
  );

  function SetEventTime() {
    const [startTime, setStartTime] = React.useState("");
    const handleChangeOne = (event) => setStartTime(event.target.value);
    const [endTime, setEndTime] = React.useState("");
    const handleChangeTwo = (event) => setEndTime(event.target.value);

    return (
      <div>
        <Container maxW="md">
          <Center>
            <VStack>
              <Heading fontSize="2xl">Time selected: {eventTime}</Heading>
              <select
                isRequired
                size="lg"
                placeholder="Select timings"
                // onChange={(event) => {setEventTime(event.target.value)}}
                onChange={handleChangeOne}
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
          <Heading fontSize='2xl'> Date selected: {startDate} </Heading>

        <Box>
        <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            injectTimes={[
              new Date().setHours(0, 1, 0),
              new Date().setHours(23, 59, 0),
            ]}
            dateFormat="MMMM d, yyyy h:mm aa"
          />
        </Box>
        {/* my calendar is not showing up. */}

        </Center>
      </div>
    );
  }

  // the return below render() the page using the components defined above.

  return (
    <div>
      {NavBar}
      <Container maxW="1100px">
        <VStack
          divider={<StackDivider borderColor="gray.200" />}
          spacing={100}
          align="stretch"
        >
          <SelectCourt />
          <SelectSport />
          <SelectProficiency />
          {/* <InviteFriends /> */}
          <SetEventTime />
          <CreationConfirmation />
          {/* after a successful confirmation, closing it will automatically bring you back to the dashboard */}
        </VStack>
      </Container>
    </div>
  );
}

/* create new document onClick button at the bottom of the screen */
