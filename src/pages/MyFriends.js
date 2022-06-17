import React from "react";
import { MdFileDownloadDone } from "react-icons/md";
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

export default function MyFriends() {
  return (
    <div>
      {NavBar}
      {myPage}
    </div>
  )
}

const NavBar = (
  <Nav image='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXcMuW_VKUySiWlRIBDilzL5F286JmZFSaQw&usqp=CAU' />
);
const myPage = <PageLayOut />

function PageLayOut() {
    return (
        <Tabs isFitted variant="soft-rounded" colorScheme="green">
        <TabList>
          <Tab>Tab 1</Tab>
          <Tab>Tab 2</Tab>
          <Tab>Tab 3</Tab>
          <Tab>Tab 4</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>{/* insert a google maps component -> to check the court postal code -> my input tab will have autosuggestions??? how to make */}</TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    )
}
