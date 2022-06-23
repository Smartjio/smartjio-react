import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import EventCard from '../components/EventCard'
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../firebase'

import {
    Box,
    Flex,
    Center,
    useColorModeValue,
  } from '@chakra-ui/react';

export default function Dashboard() {
    const [ events, setEvents ] = useState([]);
    const navigate = useNavigate();

    const bg = useColorModeValue('white', 'gray.900')

    useEffect(() => {
      const fetchEvents = async () => {
        try {
          const currentTime = new Date();
          const q = query(collection(db, "events"), where("time", ">=", currentTime));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id);
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
                      <Center key={ id } p={6}>
                        <Box
                          maxW={'100vw'}
                          w={'full'}
                          bg={ bg }
                          boxShadow={'2xl'}
                          rounded={'lg'}
                          p={6}
                          textAlign={'left'}>
                            <EventCard id={ id } />
                        </Box>
                      </Center>
                      )
                    })

    return (
        <Flex
        minH={'100vh'}
        align={'left'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
          { eventsList }
        </Flex>
      );
}
