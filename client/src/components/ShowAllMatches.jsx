import React, { useState, useEffect } from 'react';
import  {CardMatch} from './CardGameComponent';
import Image from 'react-bootstrap/Image';
import { Link, useNavigate } from "react-router-dom";
import API from '../API.mjs';
import {Col, Row, Button} from 'react-bootstrap';

import { useParams } from 'react-router-dom';



const ShowAllMatch = (props)=>{
  const [matches, setMatches] = useState([]);
   let navigate = useNavigate();
   const { id, id_match } = useParams();

  useEffect(() => {
   const matchList = async () => {
    const matches = await API.listMatchesID(id);
    setMatches(matches);
  };
  matchList();
 
}, []);


   return(
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
  {/* Scritta "Storico Partite" */}
  <div style={{ marginTop: '20px' }}>
    <h2>Storico Partite</h2>
  </div>

  {/* Bottoni "Home" e "Gioca" */}
  <div style={{ alignSelf: 'flex-end', marginRight: '20px' }}>
    <Button onClick={() => { navigate(`/`) }}
      size="lg" className="mx-2"
      style={{ marginBottom: '10px', padding: '15px 20px', backgroundColor: 'cornflowerblue' }}>Home</Button>
    <Button onClick={() => { navigate(`/round/${0}`) }}
      size="lg" className="mx-2"
      style={{ marginBottom: '10px', padding: '15px 20px', backgroundColor: 'cornflowerblue' }}>Gioca</Button>
  </div>

  {/* Contenitore Card delle Partite */}
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    {matches.map((match, index) => (
     
     <CardMatch
        key={index}
        match = {match.id}
        user={id}
        id={index}
        data={match.data}
        points={match.points}
        idUtente={match.id_utente}
       
      />
      
      
    ))}
  </div>
</div>)
}
 export  default ShowAllMatch;