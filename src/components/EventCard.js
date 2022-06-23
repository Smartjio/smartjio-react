import React, { useState, useEffect } from 'react';
import {
    Box,
    useColorModeValue,
    Heading,
    Text,
    Stack,
    Image,
  } from '@chakra-ui/react';
  import { doc, getDoc } from "firebase/firestore";
  import { db } from '../firebase';

export default function EventCard(props) {
    const [ courtData, setCourtData ] = useState('');

    const [ activity, setActivity ] = useState('');
    const [ time, setTime ] = useState('');

    useEffect(() => {
        const fetchData = async () => {
          try {
            const eventDocRef = doc(db, "events", props.id);
            const eventDocSnap = await getDoc(eventDocRef);

            if (eventDocSnap.exists()) {
                setActivity(eventDocSnap.data().activity);
                const day = eventDocSnap.data().time.toDate().getDate();
                const month = eventDocSnap.data().time.toDate().getMonth();
                const year = eventDocSnap.data().time.toDate().getFullYear();
                setTime(day + '/' + month + '/' + year);
                //console.log(eventDocSnap.data().time.toDate().getTime());
                
                const court = eventDocSnap.data().court_id;

                const courtDocRef = doc(db, "courts", court.toString());
                const courtDocSnap = await getDoc(courtDocRef);

                if (courtDocSnap.exists()) {
                    setCourtData(courtDocSnap.data());
                } else {
                    console.log("Error! No such court!")
                }
            } else {
              // doc.data() will be undefined in this case
              console.log("Error! No such event!");
            }
          } catch (error) {
            console.log(error);
          }
        }
        fetchData();
      }, [props]);

      function navigateFunction(e) {
        console.log('insert navigation here')
      }

  return (
    <Box
        role={'group'}
        p={6}
        maxW={'330px'}
        minW={'300px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'xl'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}
        onClick={navigateFunction}>
          <Image
            rounded={'lg'}
            height={230}
            width={282}
            objectFit={'cover'}
            src={ courtData.court_image }
          />
        <Stack pt={10} align={'center'}>
          <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'} align={'center'}>
            { activity }
          </Text>
          <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500} align={'center'}>
            { courtData.court_name }
          </Heading>
          <Stack direction={'row'} align={'center'}>
            <Text fontWeight={800} fontSize={'xl'}>
              { time }
            </Text>
          </Stack>
        </Stack>
      </Box>
  )
}
