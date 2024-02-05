// import { useState } from 'react'
import { Box, Button, Collapse, Container, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fade, Paper, TextField, Typography } from '@mui/material'
import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Message } from './lib/Message'
import { useEffect, useRef, useState } from 'react'
import ConversationCard from './components/Conversation'
import { Send } from '@mui/icons-material'
import { TripQuery } from './lib/TripQuery'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';

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
  const [input, setInput] = useState<string>('');
  const [trippyCollapsed, setTrippyCollapsed] = useState<boolean>(false);
  const [searchDialog, setSearchDialog] = useState<boolean>(false);
  const [goButtonEnabled, setGoButtonEnabled] = useState<boolean>(false);

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

  function onInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
      setInput(e.target.value);
  }

  function onKeyDown(e: any) {
      if (e.key === 'Enter') {
          onButtonClick();
      }
  }

  function onButtonClick() {
      const newMessage: Message = {
          sequence: NEXT_MESSAGE_ID++,
          sender: 'user',
          content: input,
      };
      setUserMessage(input);
      setMessages([...messages, newMessage]);
      setInput('');
  }  

  useEffect(() => {
    if (!ref.current) return;
    ref.current.scrollIntoView({
      block: "end",
      inline: "center",
      alignToTop: false,
      behavior: 'smooth'
    });
  }, [messages]);

  useEffect(() => {
    setGoButtonEnabled(
      tripDetails !== undefined
      && tripDetails.destination !== undefined && tripDetails.destination !== ''
      && tripDetails.checkIn !== undefined
      && tripDetails.checkOut !== undefined
      && tripDetails.numGuests !== undefined
      && tripDetails.numBedrooms !== undefined);
  }, [tripDetails]);
  
  function handleClose() {
    setSearchDialog(false);
  }
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Dialog open={searchDialog} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">
          {"This is just a demo app. No real search will be performed."}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You've selected a trip to <strong>{tripDetails.destination!} </strong> 
            from <strong>{dayjs(tripDetails.checkIn!).format('YYYY-MM-DD')} </strong>
            to <strong>{dayjs(tripDetails.checkOut!).format('YYYY-MM-DD')} </strong>
            with <strong>{tripDetails.numGuests!} guests </strong>
            and <strong>{tripDetails.numChildren!} children </strong>
            in <strong>{tripDetails.numBedrooms!} rooms</strong>.
            This is just a demo app. No real search will be performed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Header />
      <Container component="main" sx={{ display: 'flex', flexDirection: 'column', gap: 2}}>
      <Paper variant="outlined" sx={{ my: { xs: 3, md: 2 }, p: { xs: 2, md: 3 }, gap: 2, width: '100%', display: 'flex', flexDirection: 'column'}}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Typography variant="h5">Hotel Search</Typography>
          {/* <form action='' style={{ display: 'flex', flexDirection: 'column'}}> */}
          <TextField
            name="destination"
            required
            label="Destination"
            variant="standard"
            value={tripDetails.destination || ''}
            fullWidth
            onChange={(e) => {setTripDetails({...tripDetails, destination: e.target.value})}}
            sx={{ mb: 2 }}
          />
          <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2, my: 2}}>
            <DatePicker
              name="checkin"
              label="Check in"
              format="YYYY-MM-DD"
              value={dayjs(tripDetails.checkIn)}
              onChange={(e) => {setTripDetails({...tripDetails, checkIn: e ? dayjs(e).toDate(): undefined})}}
              sx={{ minWidth: 145}}
            />
            <DatePicker
              name="checkout"
              label="Check out"
              format="YYYY-MM-DD"
              value={dayjs(tripDetails.checkOut)}
              onChange={(e) => {setTripDetails({...tripDetails, checkOut: e ? dayjs(e).toDate(): undefined})}}
              sx={{ minWidth: 145}}
            />
            <TextField
              name="numguests"
              required id="location"
              label="Guests"
              variant="standard"
              type="number"
              value={tripDetails.numGuests}
              onChange={(e) => {setTripDetails({...tripDetails, numGuests: e.target.value ? Number(e.target.value) : 0})}}
              sx={{ minWidth: 60}}
            />
            <TextField
              name="numchildren"
              required id="location"
              label="Children"
              variant="standard"
              type="number"
              value={tripDetails.numChildren}
              onChange={(e) => {setTripDetails({...tripDetails, numChildren: e.target.value ? Number(e.target.value) : 0})}}
              sx={{ minWidth: 60}}
            />
            <TextField
              name="numrooms"
              required id="location"
              label="Rooms"
              variant="standard"
              type="number"
              value={tripDetails.numBedrooms}
              onChange={(e) => {setTripDetails({...tripDetails, numBedrooms: e.target.value ? Number(e.target.value) : 0})}}
              sx={{ minWidth: 60}}
            />
          </Box>
          <Button variant="contained" disabled={!goButtonEnabled} sx={{alignSelf: 'end'}} onClick={() => {setSearchDialog(true)}}><span ref={buttonRef}>Go</span></Button>
          {/* </form> */}
          </LocalizationProvider>

          <Button variant="outlined" onClick={() => {
            console.log(trippyCollapsed);
            setTrippyCollapsed(!trippyCollapsed)}
            }>Ask Trippy for Help</Button>
          <Collapse in={trippyCollapsed}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 2 }, p: { xs: 2, md: 3 }, flexGrow: 1}}>
              <Box sx={{ display: "flex", flexDirection: "column", overflow: 'auto'}}>
                  {messages.map((m) =>                 
                    <Fade key={m.sequence} in timeout={1500}>
                    <Box key={m.sequence} sx={{ display: 'flex', flexDirection: "column" }}>
                      <ConversationCard message={m}/>
                      {/* <div ref={m.sequence === messages.length - 1 ? ref : null} /> */}
                    </Box>
                    </Fade>
                  )}
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                  <TextField 
                    id="standard-basic"
                    label="Input"
                    variant="standard"
                    sx={{width: "100%"}}
                    value={input}
                    onChange={onInputChange}
                    onKeyDown={onKeyDown}
                  />
                  <Button onClick={onButtonClick}><Send /></Button>
              </Box>
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
