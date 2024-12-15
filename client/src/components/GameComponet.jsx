import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import {CardBasic} from './CardGameComponent'; // Assicurati che il percorso di importazione sia corretto
import Image from 'react-bootstrap/Image';
import { Match, Meme } from '../Models.mjs';
import { Link, useNavigate, useParams } from "react-router-dom";
import API from '../API.mjs';
import { Round } from '../../../server/MemeModels.mjs';

const timerIni = 30

function GameComponent(props) {
  const [score, setScore] = useState(0); // Punteggio
  const [rightCaptions, setRightCaptions] = useState([]); // Caption corrette
  const [timer, setTimer] = useState(timerIni); // Timer
  const {round}= useParams(); // Round corrente [opzionale
  let roundShow = parseInt(round)+1
  const [state, setState] = useState('check');
  const [selectedCaption, setSelectedCaption] = useState(null); // Caption selezionata [opzionale
  const [captions, setCaptions] = useState([]); // Usa useState per gestire le captions
  const [match, setMatch] = useState([]); // Usa useState per gestire le partite [opzionale
  const [isCorrect, setIsCorrect] = useState(false);
  let navigate = useNavigate();
  const [memes, setMemes] = useState([]); // Usa useState per gestire i meme [opzionale
  const nextRound = parseInt(round) + 1;
    let randomNum =[];


  // Funzione helper per mescolare un array
    function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Scambia gli elementi
  }
  return array;
}

    //metodo che permette di gestire la generazione dei numeri casuali per la scelta dei meme
const fetchMeme = async () => {
  const randomNumbers = generateRandomNumbers(props.numRound, 10); 
  let fetchedMemes = [];
 
  for (let i = 0; i < randomNumbers.length; i++) {
    try {
      const fetchedMeme1 = await API.getMeme(randomNumbers[i]); 
      fetchedMemes.push(fetchedMeme1);
     
    } 
    
    catch (error) {
      console.error("Errore nel recupero del meme:", error);
    }
  }
  setMemes(fetchedMemes);

};

//in modo che sia generato all'inizio in modo da inizializzare i valori
useEffect(() => {
  
  fetchMeme();
}, []);

    // Esempio di utilizzo in un effetto per caricare le caption all'avvio del componente
    useEffect(() => {
if(memes.length > 0){

       fetchCaptions();
}
  
    }, [round, memes]);
  
      
 const fetchCaptions = async () => {
        if(memes.length > 0){
        try {
          const cap = await API.listCaptionsRandom(memes[round].id);
          const capRandomPos = shuffleArray(cap); 

         handleCaptions(capRandomPos); // Aggiorna lo stato delle captions
        } catch (error) {
          console.error("Errore nel recupero del meme:", error);
        }
      };
    }



//funzione per generare i numeri casuali che mi indicano quali saranno i meme e in modo che siano diversi
const generateRandomNumbers = (num, max) => {
  const randomNumbers = new Set();
  while(randomNumbers.size <= num) {
    const randomNumber = Math.floor(Math.random() * max) + 1;
    randomNumbers.add(randomNumber);
  }
 return [...randomNumbers];
};


 


  useEffect(() => {
    // Se il timer è maggiore di 0, diminuisci di 1 ogni secondo
    if (timer > 0) {
      const timerId = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);

     
      return () => clearTimeout(timerId);
    }
    //se si ha selezionato qualcosa ma il tempo è finito
    if(state === 'check' ){

      getRightCaptions(memes[round].id, captions);
      
      handleState();
     
    }
  }, [timer]); // Dipendenze: il timer stesso, così l'effetto viene riattivato ad ogni cambiamento di timer

useEffect(() => {
  handleCorrect();
}, [rightCaptions])
       
          

   
//permette di modificare lo stato del gioco
async function  handleState  (){



//se i round finiscono si fa un controllo in modo da capire come modificare i bottoni
if(state === 'check' && parseInt(round) === props.numRound-1){


  setState('submit');
  ;
  return;
}
//se è nello stato di gioco e si preme bottone si va a stato controllo 
if(state === 'check'){

    setState('next');
      return
    }
    
   //se si ha fatto controllo si passa al prossimo round
    if(state === 'next'){
      handleMatch();
      setState('check');
      
      handleResetRound()
      setTimer(30);
      return;
    }
    
  }
  
  //mi permette di memorizzare i round per poi utilizzarli successivamente
 
  const handleMatch = () =>{
    
    const round1 = [round, selectedCaption, captions.find(caption => caption.id === selectedCaption), memes[round], score, isCorrect];
  
    props.match.push(round1); 
  
}


//metodo che permette di gestire la risposta corretta
  const handleCorrect = ( isTimeUp = false) => {
   
    if (rightCaptions.find((c )=> c.id === selectedCaption)) {
      setScore((prevScore) => prevScore + 5);
      setIsCorrect(true);
    }

    
  };

const handleResetRound = () => {
  setRightCaptions([]);
      setSelectedCaption(null);
      setIsCorrect(false);
}
  const handleReser = () => {
      setScore(0);
      setMatch([]);
      setSelectedCaption(null);
      setRightCaptions([]);
  }
  const handleMatchEnd = async() => {
    //metodo per fare il post della partita appena finita
    
    const gameData = new Match(null, null, score, props.loggedIn ? props.user.id : null);
   
    try {
      // Chiamata per creare una nuova partita
      const response = await API.newMatch(gameData);
    
      const matchArr = [...props.match];
      // Crea un array di oggetti Round da salvare
      const roundPost = matchArr.map((r, index) => new Round(index, r[3].id, r[1], response, r[5]=== true? 1 : 0));
    
      // Esegue le chiamate API per salvare ogni round e attende che tutte siano completate
      const responseRound = await Promise.all(roundPost.map(r => API.newRound(r, props.user.id)));
    
      // Gestisci qui la risposta di successo
    } catch (error) {
      console.error('Errore nel post del risultato della partita:', error);
      // Gestisci qui l'errore
    }
   
 

  }



  const handleCaptions = (cap) => {
    // Implementa la logica per gestire le caption
    setCaptions(cap);
  }
  

  const handleCardSelect = (id) => {
  
    setSelectedCaption(id);
    
  };

  

  const getRightCaptions = async (memeId, captions) => {
    const response = await API.getCaptionsID(memeId,[...captions].map(c => c.id));
    
    setRightCaptions(response);
    setTimer(0);
  
  }

 
  return (
   
    <Container style={{maxWidth: '80vw', margin: 'auto'}}>
      <Row className="justify-content-center" style ={{height: 'auto'}}>
        <Col >
          <h3>Round {roundShow}</h3>
        </Col>
      </Row>
      <Row className="justify-content-around align-items-center mt-4 " style ={{height: '100%'}}>
           <Col xs={12} md={4} lg={3} className="text-center" style={{ fontSize : '24px'}} >Score: {score}</Col>
           
        <Col xs={12} md={6} lg={5}  className="text-center">
        {memes[round] && memes[round].Image ? 
           ( <Image src={`http://localhost:3001/${memes[round].Image}`} fluid rounded style={{ maxWidth: '50%', height: 'auto' }} />) 
         : (  <p>Immagine non disponibile</p>)}
        
        {(state === 'next' ||state === 'submit' )&& <div className="text-center mt-4" > {isCorrect && <p style={{ fontSize : '24px'}}> <b>Bravo hai indovinato!</b></p> }
        {!isCorrect && <p style={{ fontSize : '24px'}}><b> Peccato, non è quella corretta </b> </p> } </div>}
        {state === 'check' && <div className="text-center mt-4">  <p> Seleziona una caption</p> </div>}  
        </Col>
        <Col xs={12} md={2} lg={4} className="d-flex flex-column align-items-center">
        <Row className="justify-content-center" style={{ fontSize : '24px'}}> Timer: {timer}</Row>
        <Row className="justify-content-center mt-3">  
          {state === 'next' && <Button  onClick = {() => {  navigate(`/round/${nextRound}`), handleState()}}
        size="lg" className="mx-2" style={{padding: '15px 20px', backgroundColor: 'cornflowerblue', borderColor: 'white', borderWidth: '2px', borderStyle: 'solid', marginBottom :' 20px'} }> { (parseInt(round) === props.numRound )? 'Fine' : 'Prossimo Round' } </Button> } 
          {state === 'check' && <Button  onClick = {() => {     getRightCaptions(memes[round].id, captions, handleState())}}
        size="lg" className="mx-2" style={{padding: '15px 20px', backgroundColor: 'cornflowerblue', borderColor: 'white', borderWidth: '2px', borderStyle: 'solid'} }> Invia </Button> } 
        
          {state === 'submit' && <Button  onClick = { () => { props.loggedIn ? (navigate(`/sumGame`), handleMatchEnd(), handleMatch() ) : (handleReser(), navigate(`/`)) }}
        size="lg" className="mx-2" style={{padding: '15px 20px', backgroundColor: 'cornflowerblue', borderColor: 'white', borderWidth: '2px', borderStyle: 'solid'}  }>  Concludi la Partita </Button> } 
        
        </Row>
       
        </Col>
        
      </Row>
      <Row className="justify-content-center" >
      {captions.map((caption, index) => (

          <Col xs={6} md={4} lg={3} key={index} className="mb-4">
           
            {state === 'check' && <CardBasic isSelectedCaption={caption.id === selectedCaption} onClick={() => handleCardSelect(caption.id)} selectedCaption={selectedCaption}  state={state}  text={caption.text} style={{ textAlign: 'center'}} />}
            {(state === 'next'|| state === 'submit') && <CardBasic isRightCaption={rightCaptions.find((c )=> c.id === caption.id)? true : false} isSelectedCaption={caption.id === selectedCaption} onClick={() => handleCardSelect(caption.id)} selectedCaption={selectedCaption} state = {state} text={caption.text} style={{ textAlign: 'center'}} />}
      
         </Col>
        ))}
       
       
      </Row>
    </Container>
  );

  
  
  
}




export default GameComponent;