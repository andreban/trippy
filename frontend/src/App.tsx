// import { useState } from 'react'
import { Container, CssBaseline } from '@mui/material'
import './App.css'
import TripDetails from './components/TripDetails'
import Footer from './components/Footer'
import Header from './components/Header'
import Conversation from './components/Conversation'
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

function App() {
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Header />
      <Container component="main" maxWidth="lg" sx={{ display: 'flex', gap: 2 }}>
        <Conversation />
        <TripDetails  />
      </Container>
      <Footer />
      </ThemeProvider>
    </>
  )
}

export default App
