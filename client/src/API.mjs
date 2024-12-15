import { Caption, Meme, Match, Round } from "./Models.mjs";

const SERVER_URL = 'http://localhost:3001';

//richiesta di un solo meme in base all'id
const getMeme = async (id) => {

    const response = await fetch(`${SERVER_URL}/api/memes/${id}`);
   if(response.ok){
         const meme = await response.json();
         return new Meme(meme.id, meme.Image);
   }
    else{
         return new Error('Meme non trovato');
    }
}
//richiesta di tutte le partite dell'utente come lo storico partite
const listMatchesID = async (id) => {
  const listMatches = await fetch(`${SERVER_URL}/api/user/${id}/matchID`);
  if(listMatches.ok){
    const matches = await listMatches.json();
    return matches.map(match => new Match(match.id, match.data, match.points, match.id_utente));
  }
  else{
    return new Error('Partite non trovate');
  }
}

//richiesta di tutti i meme
const listMemes = async () => {
    const response = await fetch(`${SERVER_URL}/api/memes`);
    if(response.ok){
        const memes = await response.json();
        return memes.map(meme => new Meme(meme.id, meme.Image));
    }
    else{
        return new Error('Meme non trovati');
    }
}



//inserire una nuova partita

const newMatch = async (match) => {
  const id=match.id_utente;
  const id_utente= match.id_utente;
  const score = match.points;
    const response = await fetch(`${SERVER_URL}/api/user/${id}/match`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id_utente: id_utente,score: score})
    });
    if(response.ok){
     return await response.json();
    }
    else{
        const errDetails = await response.text();
        return errDetails;
    }
} 

//richiesta di inserire un round associato a una partita e a un utente

const newRound = async (round, id_user) => {

  
  const id = id_user
  const id_match= round.id_match
    const response = await fetch(`${SERVER_URL}/api/user/${id}/match/${id_match}/round`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
       

        },
        body: JSON.stringify(round)
    });
    if (!response.ok) { // Corrected the condition to check for failed request
      const errDetails = await response.text();
      throw new Error(errDetails); // It's a good practice to throw Error objects
    }
    // Assuming you want to return the response JSON when the request is successful
    return await response.json();
}

//richiesta dei round della partita
const listRounds = async (id) => {
    const response = await fetch(`${SERVER_URL}/api/match/${id}/rounds`);
    if(response.ok){
        const rounds = await response.json();
        //console.log(rounds);
        return rounds;
          }
    else{
        return new Error('Round non trovati');
    }
}

//richiesta delle descizioni generiche associate a un meme
const listCaptionsRandom = async (id) => {
    const response = await fetch(`${SERVER_URL}/api/memes/${id}/captions`);
    if(response.ok){
        const captions = await response.json();
        return captions.map(caption => new Caption(caption.id, caption.text));
    }
    else{
        return new Error('Descrizioni non trovate');
    }
}


//richiesta delle descizioni generiche associate a un meme
const postCaptions = async (id, captions) => {
    const response = await fetch(`${SERVER_URL}/api/memes/${id}/captionsId`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({captions})
    });
    if(response.ok){
        const captions = await response.json();
        return captions.map(caption => new Caption(caption.id, caption.text));
    }
    else{
        return new Error('Descrizioni non trovate');
    }
}

//richiesta delle descizioni generiche associate a un meme
const getCaptionsID = async (id, captions) => {
    const response = await fetch(`${SERVER_URL}/api/meme/${id}/captionsId`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({captions})
    });
    if(response.ok) {
        const captions = await response.json();
        let captionsArray = [];
        captions.forEach(c => {

            // Creazione di un array temporaneo con due volte il testo della descrizione
            let tempArray = new Caption(c.id, c.text);
            captionsArray.push(tempArray);
        });        
        return captionsArray;
      } else {
        const errMessage = await response.json();
        throw errMessage;
      }
}




//api per gestire utente
const logIn = async (credentials) => {
    const response = await fetch(SERVER_URL + '/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    if(response.ok) {
      const user = await response.json();
      return user;
    }
    else {
      const errDetails = await response.text();
      throw new Error("Login fallito: " + errDetails); // Modifica qui
 
    }
  };
  


  
  const getUserInfo = async () => {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
      credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) {
      return user;
    } else {
      throw user;  
    }
  };

 const logOut = async() => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
}



const API = {getMeme, listRounds, logIn, listMatchesID, logOut,newRound, newMatch, getUserInfo, listMemes, postCaptions, getCaptionsID, listCaptionsRandom,  newMatch};
export default API;