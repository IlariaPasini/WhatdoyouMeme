import 'bootstrap/dist/css/bootstrap.min.css';

import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

import {LoginComponent}   from './components/LoginComponent';
import API from './API.mjs';
import ShowAllMatches from './components/ShowAllMatches';

import { Container, Row, Alert } from 'react-bootstrap';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import NavHeader from "./components/NavHeader";
import NotFound from './components/NotFound';
import HomeComponent from './components/HomeComponent';
import GameComponet from './components/GameComponet';
import ShowMatch from './components/ShowMatch';
import ShowAllRound from './components/ShowAllRound';
import './App.css';
 function App() {
  //constanti per non avere numeri magici
  const logRounds = 3;
  const noLogRounds = 1;
  let navigate = useNavigate();

  //constanti per gestire lo stato dell'applicazione

  const [loggedIn, setLoggedIn] = useState(false); // per capire se l'utente è loggato oppure no 
  const [nameUser, setNameUSer] = useState('User'); // per capire se l'utente è loggato oppure no 
  const [numRound, setNumRound] = useState(2);
  const [currentRound, setCurrentRound] = useState(0);
  const [user, setUser] = useState(null);
  const [meme, setMeme] = useState("");
  const [match, setMatch] = useState([]);

  useEffect(() => {
    // Checking if the user is already logged-in
    // This useEffect is called only the first time the component is mounted (i.e., when the page is (re)loaded.)
   
    API.getUserInfo()
        .then(user => {
            setLoggedIn(true);
            setUser(user);  // here you have the user info, if already logged in
        }).catch(e => {
            if(loggedIn)    // printing error only if the state is inconsistent (i.e., the app was configured to be logged-in)
              
            setLoggedIn(false); setUser(null);
        }); 
       
}, []);


useEffect(() => { 
  handleNumRound();}, [loggedIn]);
  const handleLogin = async (credentials) => {
    const user = await API.logIn(credentials);
    setUser(user); setLoggedIn(true);
    
};

  //funzione per gestire il numero di round in base che lutente sia loggato oppure no
  const handleNumRound = () => {
    if(loggedIn === false) {
      setNumRound(noLogRounds);
    }else {
      setNumRound(logRounds);
    }
  }
  //permette di resettare il gioco
  const resetGame = async() => {
    setMatch([]);
    //fetchMeme();
  }

 

  const handleLogout = async () => {
    await API.logOut();
    // clean up everything
    navigate('/');
    setLoggedIn(false); setUser(null);
    
  
};

  return (
    <Routes>
      <Route path = '/' element={
        <>
        <NavHeader resetGame={resetGame} loggedIn={loggedIn} handleLogout={handleLogout} user={ user ? user:'User'  }  />
        <Container  fluid className='mt-3'>      
            <Outlet/>
        </Container >
        </>
      }>
        <Route index element={  <HomeComponent  currentRound = {currentRound} loggedIn={loggedIn}></HomeComponent> } />
        <Route path='/round/:round' element={ <GameComponet  user={user} match = {match}  meme = {meme} loggedIn={loggedIn} numRound={numRound} currentRound = {currentRound} /> } />
        <Route path = '/sumGame' element={ <ShowMatch   user={user} loggedIn={loggedIn} resetGame={resetGame} match = {match} /> } />
        <Route path='/user/:id/match'  element= { <ShowAllMatches loggedIn={loggedIn} user={user} > </ShowAllMatches>}/>
        <Route path= '/user/:id/match/:id_match'  element= { <ShowAllRound loggedIn={loggedIn} user={user} > </ShowAllRound>}/>
        
        <Route path='/login' element={loggedIn ? <Navigate replace to='/' /> : <LoginComponent login={handleLogin}  />
        } />
       
        <Route path="*" element={ <NotFound/> } />

      </Route>
    </Routes>
  );

}

export default App;
