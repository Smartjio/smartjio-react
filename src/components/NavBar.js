import { ReactNode, useState, useEffect } from "react";
import { BsSun, BsMoonStarsFill } from "react-icons/bs";
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
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  ButtonProps,
  useColorMode,
  ColorModeScript,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import DarkModeButton from "../components/ColourModeToggle";
// import SuggestionCard from "./PlayerCard";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase"; // firebase.js is the db conversion.

/* const Links = [
  "Dashboard",
  "My Profile",
  "Notifications",
  "Activity",
  "Settings",
];

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={("../court", "../TestPage")}
  >
    {children}
  </Link>
); 
 as={'nav'}
spacing={4}
display={{ base: 'none', md: 'flex' }}>
{Links.map((link) => (
  <NavLink key={link}>{link}</NavLink>
))} 

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}

*/
/* The navlink cannot us used to direct a link to a page, but instead all link to the right-most href */

export default function WithAction() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  // const userRef = currentUser.uid; // cannot just read like that outside of an async function ~ might be null. 
  const [userImage, setUserImage] = useState(""); // image is a string.

  useEffect(() => {
    const getImage = async () => {
      const usersCollectionRef = collection(db, "users");
        const docRef = doc(usersCollectionRef, currentUser.uid); // can just .id? 
        const docSnap = await getDoc(docRef); // what if this has a runtime error? idk what goes on in the console
      if (docSnap.exists()) {
        setUserImage(docSnap.data().img);
        // console.log("Document data:", docSnap.data());
        // setUserImage(docSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))); this line is for without using docSnap.exits, 
      } else {
        setUserImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2aSUcU-KC_ZGl1KIFES1pwRe4YOMv2gPx_g&usqp=CAU");
        // for if they do not have a display picture -> keep value of not having a display picture as null. 
      }
    };

    getImage();
  }); // not sure what the [] after the useEffect function was for, maybe to store the array. 

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
                href="./"
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
                href="./"
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
                href="./"
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
                href="./testing"
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
                href="./jio"
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
              href={"../jio"}
              variant={"solid"}
              colorScheme={"teal"}
              size={"sm"}
              mr={4}
              leftIcon={<AddIcon />}
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
                  <Link href="./login">
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