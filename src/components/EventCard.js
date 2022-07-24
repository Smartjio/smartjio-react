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
  import { useNavigate } from 'react-router-dom';

export default function EventCard(props) {
    const [ courtData, setCourtData ] = useState('');

    const [ activity, setActivity ] = useState('');
    const [ date, setDate ] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
          try {
            const eventDocRef = doc(db, "events", props.id);
            const eventDocSnap = await getDoc(eventDocRef);

            if (eventDocSnap.exists()) {
                const data = eventDocSnap.data();
                setActivity(data.activity);
                const day = data.date.toDate().getDate();
                const month = data.date.toDate().getMonth() + 1;
                const year = data.date.toDate().getFullYear();
                const hour = data.date.toDate().getHours();
                let min = data.date.toDate().getMinutes().toString();
                while (min.length < 2) {
                  min = "0" + min;
                }
                setDate(day + '/' + month + '/' + year + ' at ' + hour + ":" + min);
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

      async function navigateEvent(e) {
        try {
          await navigate("/event/" + props.id);
        } catch (error) {
          console.log(error);
        }
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
        onClick={navigateEvent}>
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
              { date }
            </Text>
          </Stack>
        </Stack>
      </Box>
  )
}
