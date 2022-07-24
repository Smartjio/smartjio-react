import { React, useState, useEffect /* useCallback */ } from "react";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  Center,
  Heading,
  Container,
  SimpleGrid,
  Stack,
  StackDivider,
  useColorModeValue,
} from "@chakra-ui/react";

import NavBar from "../components/NavBar";
import { ActivityBoxes } from "../components/ActivityBoxes";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

// 1. query all of the events that the user is a part of.
// 2. compare to new Date(), make two lists, render them after a divider -> similar to the watch page.
// 3. query the court data and user data in another component to resolve the promise problem.

export default function Activities() {
    const { currentUser } = useAuth();
    const myId = currentUser.uid;
    const [upcoming, setUpcoming] = useState([]);
    const [thePast, setThePast] = useState([]);
    console.log("upcoming = ", upcoming);
    console.log("thePast = ", thePast);

    // show Events by chronology -> shows the upcoming event first. 
    const sortFunctionA = (a, b) => {
        return (a.date.getTime() - b.date.getTime()); 
    }

    // reverse chronology for past events to show you the most recent events 
    const sortFunctionB = (a, b) => {
        return (b.date.getTime() - a.date.getTime()); 
    }

    // "array-contains" -> inside the array of attendees -> if you organise the event, then ur uid must also be inside the attendees!!!
    useEffect(() => {
        const getActivities = async () => {
            // const tempArrayOne = [];
            // const tempArrayTwo = [];
            const tempArray = [];
            try {      
                const myQuery = query(
                    collection(db, "events"),
                    where("attendees", "array-contains", myId),
                    );
                const queryResults = await getDocs(myQuery);
                // console.log("Query Result = ", queryResults);
                queryResults.forEach((doc) => {
                    if (doc.exists()) {
                        const tempObject = doc.data()
                        tempObject.docId = doc.id; 
                        tempObject.date = doc.data().date.toDate(); // convert the firebase object into JS date object
                        tempArray.push(tempObject);
                    } else {
                        console.log("You are not part of any events yet");
                    }
                });
                const todayOclock = new Date();
                console.log("the time = ", todayOclock);
                setUpcoming(tempArray.filter((event) => (event.date.getTime() > todayOclock)).sort(sortFunctionA)); // somehow the date thing not working -> need to convert toDate()
                setThePast(tempArray.filter((event) => (event.date.getTime() <= todayOclock)).sort(sortFunctionB));
            } catch (error) {
                console.log(error);
            }
        };
        getActivities();
        }, [myId]);

  return (
    <>
      <NavBar />
      <Container maxW={'7xl'}>
      <SimpleGrid
        columns={{ base: 1, lg: 1 }} // lg to determine how many columns you want.
        spacing={{ base: 8, md: 10 }}
        py={{ base: 18, md: 10 }}>
            <Stack
            spacing={{ base: 8, sm: 6 }}
            direction={'column'}
            divider={
              <StackDivider
                borderColor={useColorModeValue('gray.200', 'gray.600')}
              />
            }>
                <Center>
                    <Heading color={"Highlight"}>My activities</Heading>
                </Center>

                {upcoming.map((event) => {
                    return (
                        <ActivityBoxes c1='green.500' c2='green.300' event_id={event.docId} date={event.date} court_id={event.court_id} participants={event.attendees} organiser={event.organiser} sport={event.activity}/>
                    )
                })}

                <Heading      
                size="md"       
                color={useColorModeValue('pink.500', 'pink.300')}
                fontWeight={'500'}
                textTransform={'uppercase'} 
                mb={'4'}>
                Past events
                </Heading>
                {thePast.map((event) => {
                    return (
                        <ActivityBoxes c1='red.500' c2='red.300' event_id={event.docId} date={event.date} court_id={event.court_id} participants={event.attendees} organiser={event.organiser} sport={event.activity}/>
                    )
                })}
            </Stack>
        </SimpleGrid>
        </Container>
    </>
  );
}

/*                 const queryOne = query(
                    collection(db, "events"),
                    where("attendees", "array-contains", myId),
                    where("date", ">", todayOclock)
                  );
                  const queryTwo = query(
                    collection(db, "events"),
                    where("attendees", "array-contains", myId),
                    where("date", "<=", todayOclock)
                  );
                  const queryResultsOne = await getDocs(queryOne);
                  const queryResultsTwo = await getDocs(queryTwo);
                  console.log("where failed = ", queryResultsOne, queryResultsTwo);
                queryResultsOne.forEach((doc) => {
                    const tempObject = doc.data()
                    tempObject.docId = doc.id; // adds docId attribute. -> for child key thing
                    // console.log("can access the document ID? = ", tempObject); 
                    tempArrayOne.push(tempObject);
                })
                queryResultsTwo.forEach((doc) => {
                    const tempObject = doc.data()
                    tempObject.docId = doc.id; 
                    // console.log("can access the document ID? = ", tempObject); 
                    tempArrayTwo.push(tempObject);
                })
                setUpcoming(tempArrayOne);
                setThePast(tempArrayTwo); */


        /* const getEventDoc = async (event_id) => {
          const eventDocRef = doc(collection(db, "events"), event_id); 
          const eventData = await getDoc(eventDocRef);
          if (eventData.exists()) {
            setMyEventData(eventData.data());
    
            const day = eventData.data().date.toDate().getDate();
            const month = eventData.data().date.toDate().getMonth();
            const year = eventData.data().date.toDate().getFullYear();
            const hour = eventData.data().date.toDate().getHours();
            let min = eventData.data().date.toDate().getMinutes().toString();
            while (min.length < 2) {
              min = "0" + min;
            }
            setDate(day + '/' + month + '/' + year + ' at ' + hour + ":" + min); // save it to the event object instead.
            
            const tempArray = eventData.data().attendees.map((person) => getParticipants(person));
            const promiseSolver = Promise.all(tempArray).then((values) => {
              return values;
            });
            const theArray = await promiseSolver;
            // console.log("theArray is = ", theArray);
            setParticipants(theArray);
            setCourtData(await getCourt(eventData.data().court_id)); // still needed that await there. 
            setOrganiserData(await getParticipants(eventData.data().organiser));
          } else {
            console.log("error");
          }
        }; */
