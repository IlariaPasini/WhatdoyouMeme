/*Modulo DAO per avere accesso ai dati divers*/
import dayjs from 'dayjs';
import  db from './db.mjs';

import {Match, Meme, Caption, Round} from './MemeModels.mjs';



  /** MEMES **/


//funzione per ottenere un meme
export const getMeme = (id) => {
    return new Promise((resolve, reject) => {
        const SQL = 'SELECT * FROM Memes WHERE id = ?';
        db.get(SQL, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }else if (row === undefined) {
                resolve({error: 'Meme non trovato'});
            } else {
                const meme = new Meme(row.ID, row.Image);
                resolve(meme);
            }
        });
    });
}

/** CAPTIONS **/
//funzione per ottenere tutte le descizione
//creata ma non viene usata
    //permette di ottenere le descrizioni associate a un meme 
    export const getCaptionsID = async (id_meme, captions) =>  {
      return new Promise ((resolve, reject) => {
        const captionsIds = captions.map(() => '?').join(',');
        const query = `
            SELECT Captions.*
            FROM Captions 
            JOIN Meme_Captions ON Captions.ID = Meme_Captions.ID_Caption
            WHERE Meme_Captions.ID_Meme = ? AND Captions.ID IN (${captionsIds})
        `;
    
        db.all(query, [id_meme, ...captions], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows.map((c) => new Caption(c.ID, c.Text)));
          }
        }); 
      })
    }
    
    //permette di ottenere tutte caption collegate 
  export const listCaptionsID = (id_meme) => {
    return new Promise((resolve, reject) => {
      const SQL = 'SELECT * FROM Captions JOIN Meme_Captions ON Captions.ID=Meme_Captions.ID_Caption WHERE Meme_Captions.ID_Meme = ?';
    db.all(SQL, [id_meme], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const captions = rows.map(row => new Caption(row.ID, row.Text));
      resolve(captions);
        });
  });
};


  //funzione per ottenere 5 descrizioni random e due associate a un meme
  export const listCaptionsRandom= (id_meme)=>{
    return new Promise((resolve, reject) => {
      //query per ottenere due descrizioni associate a un meme  
      const SQL1 = `SELECT * FROM Captions JOIN Meme_Captions 
        ON Captions.ID=Meme_Captions.ID_Caption 
        WHERE Meme_Captions.ID_Meme= ? ORDER BY RANDOM() LIMIT 2`;
      //meme per ottenere 5 descrizioni random

      let combinedResults = [];

      //prima richiesta per i due corretti
        db.all(SQL1, [id_meme] ,(err, rows) => {
          //se ci sono errori vengono mostrati per questo primo pezzo
        if (err) {
          reject(err);
          return;
          //in questo caso il meme passato non esiste
        }else if (rows === undefined) {
            resolve({error: 'Meme non trovato'});
        }
        else{  

          //inserisco i primi risultati in un array
          combinedResults = rows;
          const obtainedCaptionsID = rows.map(row => row.ID);

          const SQL2 = `SELECT Captions.* FROM Captions 
          WHERE ID NOT IN (${obtainedCaptionsID.join(',')})
          AND ID NOT IN (
            SELECT ID_Caption FROM Meme_Captions WHERE ID_Meme = ?
          ) 
          ORDER BY RANDOM() LIMIT 5`;

          //Se tutto va bene richiedo le altre 5 descrizioni
          db.all(SQL2, [id_meme], (err, rows2) => {
            if (err) {
              reject(err);
              return;
            }else if (rows2 === undefined) {
                resolve({error: 'Meme non trovato'});
            }
            else{  
              //si concatenano i risultati con quelli giusti e quelli no 
               combinedResults = combinedResults.concat(rows2).map(row => new Caption(row.ID, row.Text));
              resolve(combinedResults);
            }
          });
          
        }
       
          });
    });
  }

  /** MATCHES**/
//inserisce una nuova partita
export const postMatch = (id_utente, score) => {


  return new Promise((resolve, reject) => {
    let sql = 'SELECT ID from Users WHERE ID = ?';
    db.get(sql, [id_utente], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve({error: "L'utente è errato non esiste" + id_utente});
      } else {
        const SQL = 'INSERT INTO Matches (Data,  Points,  ID_utente) VALUES (?, ?, ?)';
        db.run(SQL, [dayjs().format('YYYY-MM-DD'), score, id_utente], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        });
      }
    });
  });
};
//tutte le partite di un utente
export const listMatchesID = (id_utente) => {

    return new Promise((resolve, reject) => {
        const SQL = 'SELECT * FROM Matches WHERE ID_utente = ?';
      db.all(SQL, [id_utente], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }else if (rows === undefined) {
            resolve({error: 'Utente non trovato'});
        }
        else{
        

            const matches = rows.map(row => new Match(row.ID, row.Data, row.Points, row.ID_utente));
            resolve(matches);
        }
       
          });
    });
  }


/** ROUNDS **/

  export const addRound = (round) => {

    return new Promise((resolve, reject) => {
        if (round.id_meme === undefined || round.id_match === undefined || round.id_round === undefined) {
            resolve({ error: 'Inserire tutti i campi' });
            return;
        }

        // fare controlli se la partita esiste
        const SQL_MATCH = 'SELECT id FROM Matches WHERE ID = ?';
        db.get(SQL_MATCH, [round.id_match], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row === undefined) {
                resolve({ error: 'Match non trovato' });
                return;
            }

            // controllo se il meme esiste
            const SQL_MEME = 'SELECT ID FROM Memes WHERE ID = ?';
            db.get(SQL_MEME, [round.id_meme], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (row === undefined) {
                    resolve({ error: 'Meme non trovato' });
                    return;
                }

               
                const SQL_INSERT = 'INSERT INTO Rounds (ID_Round, ID_Match, ID_Caption, ID_Meme, isCorrect) VALUES (?, ?, ?, ?, ?)';
                db.run(SQL_INSERT, [round.id_round, round.id_match, round.id_caption, round.id_meme, round.isCorrect], function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(this.lastID);
                });
            });
        });
    });
};

//funzione per ottenere i round associati a una partita
export const getRoundID = (id_match) => {
    return new Promise((resolve, reject) => {
        const SQL = 'SELECT * FROM Rounds WHERE ID_Match = ?';
        
      db.all(SQL, [id_match], (err, rows) => {
        if (err) {
         
          reject(err);
          return;
        }else if (rows === undefined) {
            resolve({error: 'Partita non trovata'});
        }
        else{
          
          const SQL1 = `
          SELECT 
          *
          FROM 
            Rounds 
          JOIN Memes ON Rounds.ID_Meme = Memes.ID
          LEFT JOIN Captions ON Rounds.ID_Caption = Captions.ID
          WHERE 
            Rounds.ID_Match = ?
        `;

          db.all(SQL1, [id_match], (err, rows1) => {
            if (err) {
              reject(err);
              return;
            }
            
            const rounds = rows1.map(row => ({
              roundId: row.ID_Round,
              matchId: row.ID_Match,
              memeId: row.ID_Meme,
              captionId: row.ID_Caption,
              isCorrect: row.isCorrect,
              numRound: row.ID,
              memeImage: row.Image,
              captionText: row.Text
            }));

            resolve(rounds);
          });
                  }
                
                    });
              });
            }
