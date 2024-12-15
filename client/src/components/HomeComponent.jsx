import {Row, Col, Button} from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";

export default function Home(props) {
    let navigate = useNavigate();
    let maxRounds = 3;
    let nRound = props.currentRound;

     return (
            <div >
                <Row className="justify-content-center" style={{ marginLeft: '200px',marginRight: '200px' }}>
                    <Col >
                        <h1 className="text-center" style={{marginBottom: '50px' }}> <b> Benvenuto in What do you meme? </b></h1>
                        <p> 
                            In 'What do you Meme' potrai vedere un sacco di meme che forse non conosci (anche se ne dubitiamo) 
                            e capire quali siano le migliori descrizioni.
                          </p>
                          <h4>Regole del gioco</h4>
                        <p>Ti verrà mostrato un meme e 7 possibili descrizioni il tuo compito sarà quello di scegliere la descrizione migliore tra quelle proposte entro 30 secondi!
                        </p>
                        <p>Per ogni risposta corretta guadagnerai 5 punti, per ogni risposta sbagliata nesun punto.</p>
                        <p>Se al termine del tempo non avrai selezionato nessuna didascalia, conterà come risposta non data e per cui 0 punti </p>
                        <h5><b>Attenzione! Solo due delle descrizioni possibile è più calzante per il meme presentato, riuscirai a capire quale?</b></h5>
                        <p>In ogni caso non ti preoccupare, nel caso sbagliassi ti verranno mostrare al termine del round</p>
                    </Col>
                </Row>
                <Row style={{ marginTop: '50px' }} className="justify-content-center">
                <Col md={12} className="text-center"> 
                    {!props.loggedIn && <Button  size="lg" className="mx-2" onClick = {() => {props.numRound; navigate(`/login`)}} style={ { backgroundColor: 'cornflowerblue', borderColor: 'white', borderWidth: '2px', borderStyle: 'solid' } }>Login</Button>}
                    <Button  onClick = {() => {  navigate(`/round/${props.currentRound}` ) }} size="lg" className="mx-2" style={{backgroundColor: 'cornflowerblue', borderColor: 'white', borderWidth: '2px', borderStyle: 'solid'} }>Gioca </Button> </Col>
                </Row>
            </div>
        );
}