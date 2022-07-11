import React from 'react'
import ShowSport from "../components/SportSVG";
import { Text,
} from "@chakra-ui/react";

export default function TestPage() {
  return (
    <div>
        <Text> 
            This is a testing page
        </Text>
        <ShowSport what={"basketball"} />
    </div>
  )
}
