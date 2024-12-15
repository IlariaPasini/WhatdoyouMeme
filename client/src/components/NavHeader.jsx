import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Image } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import { Link, useNavigate } from "react-router-dom";
function NavHeader(props) {
    let navigate = useNavigate();

  return (
    <Navbar style={{ backgroundColor: 'cornflowerblue' }} variant="dark">
    <Container fluid>
      <Row className="w-100">
      <Col xs={4} className="d-flex justify-content-start align-items-center">
      <Button   onClick = {() => { props.resetGame(), navigate(`/`)}} style={{ backgroundColor: 'cornflowerblue', borderColor: 'white' }}>
          <i className="bi bi-house" style={{color:'white'}}></i>
          </Button>
        </Col>
        <Col xs={4} className="d-flex justify-content-center">
        <Image src={`http://localhost:3001/asset/surprised-pikachu-meme.png` } style={{ height: '50px', marginRight: '10px' }} />
          <Navbar.Brand style={{ color: 'white', fontSize: '30px', fontWeight: 'bold'}}>What do you meme?</Navbar.Brand>
        </Col>
        <Col xs={4} className="d-flex justify-content-end align-items-center">
        
          {<span style={{ marginRight: '20px', fontSize: '20px', color: 'white'}}>Ciao, {props.user.name? props.user.name: 'User'}  </span>}
        
          {props.loggedIn ? (
       
        <Dropdown style={{ position: 'relative', right: '10px' }}  >
          <Dropdown.Toggle style={{ backgroundColor: 'white', borderColor: 'cornflowerblue', color:'cornflowerblue' }} id="dropdown-basic">
          <i className="bi bi-person-circle" style={{color:'cornflowerblue'}}></i>
          </Dropdown.Toggle>

          <Dropdown.Menu align="end" style={{ position: 'absolute', right: '0' }}>
            <Dropdown.Item onClick={()=>( navigate(`/user/${props.user.id}/match`))}>Storico</Dropdown.Item>
            <Dropdown.Item onClick={()=> {props.handleLogout()}}>Esci</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        // Bottone per utenti non loggati
        <Button onClick={() => navigate(`/login`)} style={{ backgroundColor: 'cornflowerblue', borderColor: 'white' }}>
          <i className="bi bi-person-circle"></i>
        </Button>
      )}
        </Col>
      </Row>
    </Container>
  </Navbar>
  );
}

export default NavHeader;