import React, { useState, useEffect } from 'react';
import {CardBasic, CardEnd} from './CardGameComponent'; // Assicurati che il percorso di importazione sia corretto
import Image from 'react-bootstrap/Image';
import { Link, useNavigate } from "react-router-dom";
import API from '../API.mjs';
import {Col, Row, Button} from 'react-bootstrap';
const ShowMatch = (props)=>{
    let navigate = useNavigate();

 
    return(
        
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <h1 style={{ marginBottom: '20px' }}>Partita</h1>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        {props.match.every(matchItem => !matchItem[5]) ? (
      // Se tutti gli elementi matchItem[6] sono vuoti, mostra questo:
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
       <Image src={`http://localhost:3001/kermit.png`} fluid rounded style={{ maxWidth: '50%', height: 'auto' }} />
       <div style={{ marginTop: '20px' }}>Nessuna partita da mostrare</div>
      </div>
    ) : (
      // Altrimenti, mostra la lista come prima
      <Row className="justify-content-center" style={{ width: '100%', flexWrap: 'wrap' }}>
        {props.match.map((matchItem, index) => (
          matchItem[5] ? (
            <Col xs={12} md={4} lg={3} style={{ display: 'flex', justifyContent: 'center', marginBottom: '4rem' }} key={index}>
              <CardEnd 
                state={'fine'} 
                text={ matchItem[2].text} 
                isCorrect = {1}
                image={matchItem[3].Image}
                style={{ textAlign: 'center', marginTop: '10px' }}
              />
            </Col>
          ) : null
        ))}
      </Row>
    )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button  onClick = {() => { props.resetGame(); navigate(`/`)}}
        size="lg" className="mx-2" style={{padding: '15px 20px', backgroundColor: 'cornflowerblue', borderColor: 'white', borderWidth: '2px', borderStyle: 'solid', marginBottom :' 20px'} }> Home</Button>
       {props.loggedIn &&  <Button  onClick = {() => { props.resetGame(); navigate(`/user/${props.user.id}/match`)}}
        size="lg" className="mx-2" style={{padding: '15px 20px', backgroundColor: 'cornflowerblue', borderColor: 'white', borderWidth: '2px', borderStyle: 'solid', marginBottom :' 20px'} }> Storico Partite </Button>
     }
        </div>
          
    </div>
)
}

export default ShowMatch;