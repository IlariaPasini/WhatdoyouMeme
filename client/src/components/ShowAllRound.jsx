import React, { useState, useEffect } from 'react';
import  {CardEnd, CardBasic} from './CardGameComponent';
import Image from 'react-bootstrap/Image';
import { Link, useNavigate } from "react-router-dom";
import API from '../API.mjs';
import {Col, Row, Button} from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';



const ShowAllRound = (props)=>{
  const [matches, setMatches] = useState([]);
   let navigate = useNavigate();
   const {id_utente, id_match } = useParams();

  useEffect(() => {
   const roundList = async () => {
    const matches = await API.listRounds(id_match);
    setMatches(matches);
  };
  roundList();
 
}, []);

  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
    <h1 style={{ marginBottom: '20px' }}>Round Partita</h1>
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    <Row className="justify-content-center" style={{ width: '100%', flexWrap: 'wrap' }}>
           
        {matches.map((m, index) => (
           <Col xs={12} md={4} lg={3} style={{ display: 'flex', justifyContent: 'center', marginBottom: '4rem' }} key={index}>
                   
          <CardEnd
            key={index} // Aggiunto per migliorare le performance e prevenire warning
            state={'fine'} 
            text={m.captionText ? m.captionText : 'Non hai selezionato nulla'} 
            isCorrect = {m.isCorrect} 
            image={m.memeImage}
          />
           </Col>
        ))}
    </Row>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button  onClick = {() => {  navigate(`/`)}}
        size="lg" className="mx-2" style={{padding: '15px 20px', backgroundColor: 'cornflowerblue', borderColor: 'white', borderWidth: '2px', borderStyle: 'solid', marginBottom :' 20px'} }> Home</Button>
       {props.loggedIn &&  <Button  onClick = {() => {  navigate(`/user/${props.user.id}/match`)}}
        size="lg" className="mx-2" style={{padding: '15px 20px', backgroundColor: 'cornflowerblue', borderColor: 'white', borderWidth: '2px', borderStyle: 'solid', marginBottom :' 20px'} }> Storico Partite </Button>
     }
        </div>
    </div>
  );
}
 export  default ShowAllRound;