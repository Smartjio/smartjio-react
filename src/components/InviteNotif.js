import React from 'react'

import {
  Box,
} from "@chakra-ui/react";

import Avatar from "./AvatarRipple";

export default function InviteNotification(props) {
  return (
    <div>
      <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
      <Avatar display_picture={props.sender_image} user_name={props.sender_name} player_level={props.sender_level}/>
      
      </Box>
    </div>
  )
}
