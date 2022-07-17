import { useState, useEffect } from "react";
import { MdLogout } from "react-icons/md";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import DarkModeButton from "../components/ColourModeToggle";
import {
  collection,
  getDoc,
  doc,
} from "firebase/firestore";

import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase"; // firebase.js is the db conversion.

export default function WithAction() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  // console.log("how is this undefined?", currentUser);
  // const userID = currentUser.uid; // can only do this inside useEffect because it can be null!!!!!
  const [userImage, setUserImage] = useState(""); // image is a string.

  useEffect(() => {
    const getImage = async () => {
      const usersCollectionRef = collection(db, "users");
      const docRef = doc(usersCollectionRef, currentUser.uid); // can just currentUser.uid -> reading properties of undefined 
      const docSnap = await getDoc(docRef); // what if this has a runtime error? idk what goes on in the console
        /* if (docSnap.data().img === "") {
            setUserImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2aSUcU-KC_ZGl1KIFES1pwRe4YOMv2gPx_g&usqp=CAU");
        } else {
            setUserImage(docSnap.data().img);
            console.log("Document data:", docSnap.data());
        } */

      if (docSnap.exists()) {
        setUserImage(docSnap.data().img);
        // console.log("Document data:", docSnap.data());
        // setUserImage(docSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))); 

        // what if img: ""? 
      } else {
        setUserImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2aSUcU-KC_ZGl1KIFES1pwRe4YOMv2gPx_g&usqp=CAU");
        // for if they do not have a display picture -> keep value of not having a display picture as null. 
      }
    };
    getImage();
  }, [currentUser]); // [] ensures that the useEffect function only runs once! -> must include current user in [] to make it work!!!

  // console.log(currentUser);
  // console.log(usersCollectionRef);

  async function handleLogout(e) {
    try {
      await logout();
      navigate("/login");
    } catch {
      setError("Failed to log out");
      console.log(error);
    }
  }

  async function handleJio(e) {
    try {
      await navigate("/jio");
    } catch {
      setError("Failed to log out");
      console.log(error);
    }
  }

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            /* this IconButton cannot be seen in my NavBar leh */
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
            /* wtf is this isOpen thing? */
          />
          <HStack spacing={8} alignItems={"center"}>
            {/* put the svg here for the settings or some shyt */}
            <HStack>
              <Link
                px={2}
                py={1}
                rounded={"md"}
                _hover={{
                  textDecoration: "none",
                  bg: useColorModeValue("gray.200", "gray.700"),
                }}
                href="/"
              >
                DashBoard
              </Link>
              <Link
                px={2}
                py={1}
                rounded={"md"}
                _hover={{
                  textDecoration: "none",
                  bg: useColorModeValue("gray.200", "gray.700"),
                }}
                href={"/profile/" + currentUser.uid}
              >
                My Profile
              </Link>
              <Link
                px={2}
                py={1}
                rounded={"md"}
                _hover={{
                  textDecoration: "none",
                  bg: useColorModeValue("gray.200", "gray.700"),
                }}
                href="/notification"
              >
                Notifications
              </Link>
              <Link
                px={2}
                py={1}
                rounded={"md"}
                _hover={{
                  textDecoration: "none",
                  bg: useColorModeValue("gray.200", "gray.700"),
                }}
                href="/venues"
              >
                Venues
              </Link>
              <Link
                px={2}
                py={1}
                rounded={"md"}
                _hover={{
                  textDecoration: "none",
                  bg: useColorModeValue("gray.200", "gray.700"),
                }}
                href="/activities"
              >
                Activities
              </Link>
              <Link
                px={2}
                py={1}
                rounded={"md"}
                _hover={{
                  textDecoration: "none",
                  bg: useColorModeValue("gray.200", "gray.700"),
                }}
                href="/settings"
              >
                Settings
              </Link>
              <DarkModeButton />
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            {/* stay on the same page */}
            <Button
              as="a"
              target="_blank"
              // href="/jio"
              variant={"solid"}
              colorScheme={"teal"}
              size={"sm"}
              mr={4}
              leftIcon={<AddIcon />}
              onClick={() => handleJio()}
            >
              Create Jio
              {/* This button brings you to the EventCreation page */}
            </Button>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar size={"md"} src={userImage} />
                {/* display picture should be shown */}
              </MenuButton>
              <MenuList>
                {/* <MenuDivider /> */}
                <MenuItem
                  icon={<MdLogout />}
                  onClick={() => handleLogout()} /* command='⌘O' */
                >
                  <Link href="/login">
                    Logout
                    {/* update the logout function to close the connection to the site, so that going back will require a login */}
                  </Link>
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}