import React from "react";
import {
  MdOutlineSportsBasketball,
  MdOutlineSportsBaseball,
  MdOutlineSportsVolleyball,
  MdOutlineSportsTennis,
  MdOutlineSportsHandball,
  MdOutlineSportsSoccer,
  MdOutlineThumbDownAlt,
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
import Avatar from "../components/AvatarRipple"; // choose friends from their avatar and user_name.

const NavBar = (
  <Nav image="https://uci.nus.edu.sg/suu/wp-content/uploads/sites/5/2020/10/MPSH-1024x681.jpg" />
); // this will be queried in the NavBar componenet instead of having to rewrite a query for every single loading of the page.

export default function EventCreation() {
  return (
    <div>
      {NavBar}
      {/* {myProcess} */}
      <VStack
        divider={<StackDivider borderColor="gray.200" />}
        spacing={100}
        align="stretch"
      >
        <SelectCourt />
        <SelectSport />
        <SelectProficiency />
      </VStack>
    </div>
  );
}

// query for how many friends do you have, then find a way to display all of them?
function MyFriends() {
  return <div></div>;
}

function SelectCourt() {
  const [value, setValue] = React.useState("");
  const handleChange = (event) => setValue(event.target.value);
  /* use value to go do the query, but in the meantime, can just set on top for us to see */
  return (
    <div>
      <Center>
        Court Value is: <text mb="8px">{value}</text>
      </Center>
      <Container maxW="md">
        <FormControl isRequired size="lg">
          <FormLabel htmlFor="Court">Select Court</FormLabel>
          <Input
            id="court_id"
            variant="filled"
            placeholder="Enter Court Name"
            value={value}
            onChange={handleChange}
          />
        </FormControl>
      </Container>
    </div>
  );
}

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
            <Heading fontSize="4xl">Choose Sport</Heading>
            <select
              isRequired
              size="lg"
              borderColor="blue"
              placeholder="Select Sport"
            >
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
    </div>
  );
}

function SelectProficiency() {
  return (
    <div>
      <Container maxW="md">
        <Center>
          <VStack>
            <Heading fontSize="4xl">Set Proficiency level</Heading>
            <select isRequired size="lg" placeholder="Select Proficiency Level">
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

/* create new document onClick button at the bottom of the screen */

function InviteFriends() {
  return <div></div>;
}
