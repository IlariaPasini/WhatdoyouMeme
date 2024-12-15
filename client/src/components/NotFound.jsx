import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate da react-router-dom
import Button from 'react-bootstrap/Button'; // Importa Button da react-bootstrap
import Image from 'react-bootstrap/Image'; // Importa Image da react-bootstrap

export default function NotFound() {
    const navigate = useNavigate(); // Utilizza useNavigate per la navigazione

    return(
        <div className="not-found-container text-center">
            <p className="lead">Sembra che tu ti sia perso...</p>
            <p>Come sei arrivato qui? Neanche noi lo sappiamo.</p>
            <p>Ma non preoccuparti, ti aiutiamo noi!</p>
            <Image src="/public/404.jpg" alt="Not Found" fluid />
             <div style={{ marginTop: '20px' }}>
             <Button onClick={() => { navigate(`/`) }}
      size="lg" className="mx-2"
      style={{ marginBottom: '10px', padding: '15px 20px', backgroundColor: 'cornflowerblue' }}>Home</Button>
    </div>
        </div>
    );
}