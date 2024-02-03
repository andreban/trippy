// import { useState } from 'react'
import { Box, Button, Container, CssBaseline, Fade, Paper, TextField, Typography } from '@mui/material'
import './App.css'
import TripDetails from './components/TripDetails'
import Footer from './components/Footer'
import Header from './components/Header'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Message } from './lib/Message'
import { useEffect, useRef, useState } from 'react'
import ConversationCard from './components/Conversation'
import { Send } from '@mui/icons-material'
import { TripQuery } from './lib/TripQuery'

const defaultTheme = createTheme();
let NEXT_MESSAGE_ID: number = 0;
const MESSAGES: Message[] = [
    // {sequence: NEXT_MESSAGE_ID++, content: 'Hello, where do you want to travel to?', sender: 'bot'},
];

function App() {
  const ref = useRef<any>();
  const [tripDetails, setTripDetails] = useState<TripQuery>();
  const [sessionId, setSessionId] = useState<string>();
  const [userMessage, setUserMessage] = useState<string>();
  const [messages, setMessages] = useState<Message[]>(MESSAGES);
  const [input, setInput] = useState<string>('');

  // Creates the initial session.
  useEffect(() => {
      fetch('/api/prompt')
          .then(response => response.json())
          .then(data => {
              setSessionId(data.sessionId);
              const robotMessage: Message = {
                  sequence: NEXT_MESSAGE_ID++,
                  sender: 'bot',
                  content: data.response.nextPrompt,            
              };
              setTripDetails(data.response);
              setMessages(m => [...m, robotMessage]);
          });
  }, []);

  useEffect(() => {
      if (!userMessage || !sessionId) {
          return;
      }
      fetch(`/api/prompt?prompt=${userMessage}&session_id=${sessionId}`)
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
              setTripDetails(data.response);
              setMessages(m => [...m, robotMessage]);
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
  
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Header />
      <Container component="main" maxWidth="lg" sx={{ display: 'flex', gap: 2, maxHeight: '80vh'}}>
      <Paper variant="outlined" sx={{ my: { xs: 3, md: 2 }, p: { xs: 2, md: 3 }, flexGrow: 1, height: '80vh'}}>
            <Typography variant="h5">Trippy Conversation</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", overflow: 'auto', maxHeight: '85%', height: '85%'}}>
                {messages.map((m) =>                 
                  <Fade key={m.sequence} in timeout={1500}>
                  <Box key={m.sequence} sx={{ display: 'flex', flexDirection: "column" }}>
                    <ConversationCard message={m}/>
                    <div ref={m.sequence === messages.length - 1 ? ref : null} />
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
        <TripDetails details={tripDetails}/>
      </Container>
      <Footer />
      </ThemeProvider>
    </>
  )
}

export default App
