import React from 'react'
import { useAuth } from '../contexts/AuthContext'

import {
    Button,
    Flex,
  } from "@chakra-ui/react";

import { AddIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";

export default function FriendButton(props) {
    const { userData } = useAuth();
    // add friend, friend req sent, remove friend, (currently own profile aka no button)
    // function currentState() {
    //     if 
    // }
    function searchFriends(id) {
        return id === props.id;
    }

    const isFriend = userData.friends.find(id => searchFriends(id))
    // const isRequested = userData.requested.find(id => searchFriends(id))

    // console.log(userData)
    // console.log(isUser)
    // console.log(props.id)
    // console.log(currentUser.uid)
    // console.log(isFriend)

  return (
    <Flex h={16} alignItems={"center"} justifyContent={"right"}>
        {!isFriend && <Button
            as="a"
            target="_blank"
            variant={"solid"}
            colorScheme={"cyan"}
            size={"sm"}
            mr={4}
            leftIcon={<AddIcon />}
            // onClick={}
            >
            Add Friend
        </Button>}

        {!isFriend && <Button
            as="a"
            target="_blank"
            variant={"solid"}
            colorScheme={"green"}
            size={"sm"}
            mr={4}
            leftIcon={<CheckIcon />}
            // onClick={}
            >
            Request Sent
        </Button>}

        {isFriend && <Button
            as="a"
            target="_blank"
            variant={"solid"}
            colorScheme={"red"}
            size={"sm"}
            mr={4}
            leftIcon={<CloseIcon />}
            // onClick={}
            >
            Remove Friend
        </Button>}

    </Flex>
  )
}
