import React, { useState, useEffect } from 'react'
import EventCard from '../components/EventCard'
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../firebase';
import NavBar from "../components/NavBar";

import {
    Box,
    Heading,
    Center,
    useColorModeValue,
    Wrap,
    WrapItem,
    Stack,
  } from '@chakra-ui/react';

export default function Dashboard() {
    const [ events, setEvents ] = useState([]);

    const bg = useColorModeValue('white', 'gray.900')

    useEffect(() => {
      const fetchEvents = async () => {
        try {
          const currentTime = new Date();
          const q = query(collection(db, "events"), where("date", ">=", currentTime));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            setEvents(events => [...events, doc.id]);
            setEvents(events => [...new Set(events)]);
          });
        } catch (error) {
          console.log(error);
        }
      }
      fetchEvents();
    }, []);

    // console.log(events)
    var eventsList = events.map(function(id) {
                      return (
                        <WrapItem key={id}>
                            <Box
                              minW={'310px'}
                              w={'full'}
                              bg={ bg }
                              boxShadow={'xl'}
                              rounded={'lg'}
                              p={6}
                              textAlign={'left'}>
                                <Center>
                                  <EventCard id={ id } />
                                </Center>
                            </Box>
                        </WrapItem>
                      )
                    })

    return (
      <>
      <NavBar />
      <Center justify={'left'} p={2}>
        <Stack>
          <Heading align={'center'}>
            Dashboard
          </Heading>
          <Wrap justify={'center'} spacing={'50px'}>
            {eventsList}
          </Wrap>
        </Stack>
      </Center>
      </>
      );
}
