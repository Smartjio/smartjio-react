import { ReactNode } from "react";
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

const Links = [
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
    {/* i need to find a way to make a list to reference where to  */}
    {children}
  </Link>
);

/* as={'nav'}
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

export default function WithAction(props) {
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
                <Avatar size={"md"} src={props.image} />
              </MenuButton>
              <MenuList>
                {/* <MenuDivider /> */}
                <MenuItem icon={<MdLogout />} /* command='⌘O' */>
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




/* function DarkModeButton() {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
      <header>
        <Button onClick={toggleColorMode}>
          Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
        </Button>
      </header>
    )
  } */
