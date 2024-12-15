import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";


function LoginComponent(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };

    props.login(credentials)
      .then ( () => navigate( "/" ) )
      .catch( (err) => {
        if(err.message === "Unauthorized")
          setErrorMessage("Invalid username and/or password");
        else
          setErrorMessage('Errore nella procedura di login');
        

        setShow(true);
      });
  };

  return (
    <Row className="mt-3 vh-100 justify-content-md-center">
      <Col md={4} >
        <h1 className="pb-3">Login</h1>
        <h5 className="pb-3">Inserisci username e password per poter giocare le partite, memorizzarle e rivederle successivamente</h5>
        <Form onSubmit={handleSubmit}>
          <Alert
                dismissible
                show={show}
                onClose={() => setShow(false)}
                variant="danger">
                {errorMessage}
          </Alert>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={username} placeholder="Example: john.doe@polito.it"
              onChange={(ev) => setUsername(ev.target.value)}
              required={true}
            />
          </Form.Group>
            <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password} placeholder="Enter the password."
              onChange={(ev) => setPassword(ev.target.value)}
              required={true} minLength={6}
              />
          </Form.Group>
          <Button style={{ backgroundColor: 'cornflowerblue', borderColor: 'white', marginRight : '20px' }} className="mt-3" type="submit">Accedi</Button>
          <Button style={{ backgroundColor: 'cornflowerblue', borderColor: 'white' }} className="mt-3" onClick={()=>{navigate('/')}}>Continua come Guest</Button>
       
        </Form>
       
      </Col>
    </Row>
  )
}

LoginComponent.propTypes = {
  login: PropTypes.func,
}

function LogoutButton(props) {
  return (
    <Button variant="outline-light" onClick={props.logout}>Logout</Button>
  )
}

LogoutButton.propTypes = {
  logout: PropTypes.func
}

function LoginButton() {
  const navigate = useNavigate();
  return (
    <Button style={{ backgroundColor: 'cornflowerblue', borderColor: 'white' }} onClick={()=> navigate('/login')}>Login</Button>
  )
}
export  { LoginComponent, LogoutButton, LoginButton };