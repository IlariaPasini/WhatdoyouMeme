import React, { useEffect, useState } from 'react';
import { Button, Col } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import '/src/App.css'
const CardBasic = (props) => {
  // Stato per tracciare se la carta è selezionata
  const [isSelected, setIsSelected] = useState(false);
  const handleMouseEnter = () => setIsSelected(true);
  const handleMouseLeave = () => setIsSelected(false);
  const [style, setIsRight] = useState('cardStyle');
   // Mappa le combinazioni di isRightCaption e isSelectedCaption ai colori
   const colorMap = {
    'true_true': 'cardStyleCorrect', // Verde
    'false_false': 'cardStyle', //Bianca
    'true_false': 'cardStyleSelected', // Viola
    'false_true': 'cardStyleWrong', // Viola
  };

  // Determina la chiave da utilizzare per ottenere il colore corretto dalla mappa
  const getColorClass = () => {
    const key = `${props.isRightCaption}_${props.isSelectedCaption}`;
   setIsRight(colorMap[key] || 'cardStyle'); // Bianco come default
  };

  useEffect(() => {getColorClass()}, [props.isSelectedCaption, props.isRightCaption ]);
  return (
    <div style={{ textAlign: 'center', justifyContent: 'center' }}>
      {props.state === 'check'&&
        <Button className= {props.isSelectedCaption ? 'cardStyleSelected' : 'cardStyle'}  onClick={props.state === 'next'? null : props.onClick} >
        {props.text}
        </Button>
      }
      {(props.state === 'next' || props.state ==='submit') &&
        <Button className={style} onClick={()=> props.state === 'next' ? null : props.onClick}>
        {props.text}
        </Button>
      }
     
    </div>
  );
};
const CardEnd = (props) => {



  return (
    <div style={{ textAlign: 'center', justifyContent: 'center' }}>
    
      <Card className='buttonWithContent' >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Image src={`http://localhost:3001/${props.image}`} style={{ width: '300px', height: '300px', objectFit: 'cover', borderRadius: '20px', marginBottom: '30px'  }}/>
         Punteggio: { props.isCorrect === 1  ? '+5':'0' }<br />
        {props.text!==null? props.text : 'Nessuna descrizione'}<br />
       
        </div>

      </Card>
    </div>
  );
}

const CardMatch = (props) => {
  let navigate = useNavigate();
  const [isSelected, setIsSelected] = useState(false);
  const handleMouseEnter = () => setIsSelected(true);
  const handleMouseLeave = () => setIsSelected(false);
  return (

      <div style={{ textAlign: 'center', justifyContent: 'center' }}>
      <Button className='cardStyle' onClick={() => { navigate(`/user/${props.id_utente}/match/${props.match}`) }}>
             <div>
            <b>Partita {props.id}</b> <br />
            Data: {new Date(props.data).toLocaleDateString()} <br />
            Points: {props.points}
          </div>
        </Button>
      </div>
    );
   

  

}

export  {CardBasic, CardEnd, CardMatch};