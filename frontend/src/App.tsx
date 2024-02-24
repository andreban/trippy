import { Button, Collapse, Container, CssBaseline, Paper } from '@mui/material'
import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Message } from './lib/Message'
import { useEffect, useRef, useState } from 'react'
import { TripQuery } from './lib/TripQuery'
import dayjs from 'dayjs';
import Messages from './components/Messages';
import MessageInput from './components/MessageInput';
import SearchForm from './components/SearchForm';
import SearchDialog from './components/SearchDialog';

const PROMPT_URL = import.meta.env.VITE_PROMPT_BASE_URL;

const defaultTheme = createTheme();
let NEXT_MESSAGE_ID: number = 0;
const MESSAGES: Message[] = [
    // {sequence: NEXT_MESSAGE_ID++, content: 'Hello, where do you want to travel to?', sender: 'bot'},
];

function App() {
  const ref = useRef<any>();
  const buttonRef = useRef<any>();
  const [tripDetails, setTripDetails] = useState<TripQuery>({    
    destination: '',
    checkIn: new Date(),
    checkOut: new Date(),
    numGuests: 1,
    numChildren: 0,
    numBedrooms: 1,
  });
  const [sessionId, setSessionId] = useState<string>();
  const [userMessage, setUserMessage] = useState<string>();
  const [messages, setMessages] = useState<Message[]>(MESSAGES);
  const [trippyCollapsed, setTrippyCollapsed] = useState<boolean>(false);
  const [searchDialog, setSearchDialog] = useState<boolean>(false);

  // Creates the initial session.
  useEffect(() => {
      fetch(PROMPT_URL)
          .then(response => response.json())
          .then(data => {
              setSessionId(data.sessionId);
              const robotMessage: Message = {
                  sequence: NEXT_MESSAGE_ID++,
                  sender: 'bot',
                  content: data.response.nextPrompt,            
              };
              setTripDetails(tripDetails => {
                const newTripDetails = {...tripDetails};
                newTripDetails.destination = data.response.destination ? data.response.destination : newTripDetails.destination;
                newTripDetails.checkIn = data.response.checkIn ? dayjs(data.response.checkIn).toDate() : newTripDetails.checkIn;
                newTripDetails.checkOut = data.response.checkOut ? dayjs(data.response.checkOut).toDate() : newTripDetails.checkOut;
                newTripDetails.numGuests = data.response.numGuests ? data.response.numGuests : newTripDetails.numGuests;
                newTripDetails.numChildren = data.response.numChildren ? data.response.numChildren : newTripDetails.numChildren;
                newTripDetails.numBedrooms = data.response.numBedrooms ? data.response.numBedrooms : newTripDetails.numBedrooms;                
                return newTripDetails;
              });
              setMessages(m => [...m, robotMessage]);
          });
  }, []);

  useEffect(() => {
      if (!userMessage || !sessionId) {
          return;
      }
      fetch(`${PROMPT_URL}?prompt=${userMessage}&session_id=${sessionId}`)
          .then(response => response.json())
          .then(data => {
              console.log(data);
              if (!sessionId) {
                  setSessionId(data.sessionId);
              }
              const robotMessage: Message = {
                  sequence: NEXT_MESSAGE_ID++,
                  sender: 'bot',
                  content: data.response.nextPrompt,            
              };

              setTripDetails(tripDetails => {
                const newTripDetails = {...tripDetails};
                newTripDetails.destination = data.response.destination ? data.response.destination : newTripDetails.destination;
                newTripDetails.checkIn = data.response.checkIn ? dayjs(data.response.checkIn).toDate() : newTripDetails.checkIn;
                newTripDetails.checkOut = data.response.checkOut ? dayjs(data.response.checkOut).toDate() : newTripDetails.checkOut;
                newTripDetails.numGuests = data.response.numGuests ? data.response.numGuests : newTripDetails.numGuests;
                newTripDetails.numChildren = data.response.numChildren ? data.response.numChildren : newTripDetails.numChildren;
                newTripDetails.numBedrooms = data.response.numBedrooms ? data.response.numBedrooms : newTripDetails.numBedrooms;                
                console.log(newTripDetails);              
                return newTripDetails;
              });

              if (data.response.complete) {
                buttonRef.current.scrollIntoView({
                  block: "end",
                  inline: "center",
                  alignToTop: false,
                  behavior: 'smooth'
                });
                setTrippyCollapsed(false);
              } else {
                setMessages(m => [...m, robotMessage]);
              }
          });

  }, [userMessage, sessionId]);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.scrollIntoView({
      block: "end",
      inline: "center",
      alignToTop: false,
      behavior: 'smooth'
    });
  }, [messages]);

  
  function onSendMessage(message: string) {
    const newMessage: Message = {
        sequence: NEXT_MESSAGE_ID++,
        sender: 'user',
        content: message,
    };
    setUserMessage(message);
    setMessages([...messages, newMessage]);
} 
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <SearchDialog open={searchDialog} setOpen={setSearchDialog} tripQuery={tripDetails} />
      <Header />
      <Container component="main" sx={{ display: 'flex', flexDirection: 'column', gap: 2}}>
      <Paper variant="outlined" sx={{ my: { xs: 3, md: 2 }, p: { xs: 2, md: 3 }, gap: 2, width: '100%', display: 'flex', flexDirection: 'column'}}>
          <SearchForm tripQuery={tripDetails} setTripQuery={setTripDetails} onSubmit={() => {setSearchDialog(true)}} />
          <Button
            variant="outlined"
            onClick={() => {        
              setTrippyCollapsed(!trippyCollapsed)
            }}
          >Ask Trippy for Help</Button>
          <Collapse in={trippyCollapsed}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 2 }, p: { xs: 2, md: 3 }, flexGrow: 1}}>
              <Messages messages={messages} />
              <MessageInput onSend={onSendMessage} />
          </Paper>
          <div ref={ref} />
          </Collapse>
      </Paper>
      </Container>
      <Footer />
      </ThemeProvider>
    </>
  )
}

export default App
