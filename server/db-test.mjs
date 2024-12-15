import sqlite from 'sqlite3';
import fs from 'fs';
import { getMeme, getRoundID,listCaptionsRandom, getCaptionsID, listMatchesID, postMatch, listCaptionsID, addRound} from './dao.mjs';
import { Caption, Round } from './MemeModels.mjs';
import { getUserById } from './userDao.mjs';
import { Match } from './MemeModels.mjs';
const db = new sqlite.Database('Games.db', (err) => {
    if (err) throw err;
  });

/*
  let sql = 'SELECT * FROM Meme';
  let results = [];
  db.all('SELECT * FROM Caption',  (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }

    rows.forEach(row => {
      fs.access(row.Image, fs.constants.F_OK, (err) => {
        if (err) {
          console.log(`File ${row.Image} does not exist` );
        } else {
          console.log(`File  ${row.Image} SI` );
        }
      });
      console.log(row);
    });
  });
*/

async function testMeme() {
  const memes = await listMemes();
  console.log(memes);
}
const id_meme = 1;
async function testMemeOne(id_meme) {
  const memes = await getMeme(id_meme);
  console.log(memes);
}

async function testCaptions() {
  const captions = await listCaptions();
  console.log(captions);
}

async function testMatches(id_meme) {
  const matches = await listMatchesID(id_meme);
  console.log(matches);
}

const id_utente = 1;
const score = 15;
async function testAddMatch(id_utente, score) {
  const matches = await postMatch(id_utente, score);
  console.log(matches);
}
const id_meme3 =4
async function testCaptions_meme(id_meme3) {
  const captions = await listCaptionsID(id_meme3);
  console.log(captions);
}

async function testCaptionCasuali(id_meme){
  const captions = await listCaptionsRandom(id_meme);
  console.log(captions);

}
let roundOr = new Round(3, 4, 1, 1);
async function testRound(round){
const roundA = await addRound(round);
  console.log(roundA);
}

const cap_meme4 = new Caption(1, "Fallisco l' esame per cui non ho studiato");
const cap_meme5 = new Caption(10, "Quando ripaghi il riscatto del Ransomware ma i dati rimangono bloccati");
let captions1 = [cap_meme4, cap_meme5];

async function testCaptionCasualiID(id_meme, captions){
  const captions1 = await getCaptionsID(id_meme, captions.map(c => c.id));
  console.log(captions1);
}


async function testRoundID(){
  const round1 = await getRoundID(1);
  console.log(round1);

}
const match1 = new Match(1, 1, 1, 1);
async function testPostMatch(match){
  const match2 = await postMatch(match);
  console.log(match2);

}


async function testGetMatch(id){
  const match = await listMatchesID(id);
  console.log(match);
}

//testMeme();
//testMemeOne(id_meme);
//testCaptions(id_meme);
//testMatches(2);
//testAddMatch(id_utente, score);
//testCaptions_meme(id_meme3);
//testCaptionCasuali(id_meme3);
//testCaptionCasualiID(id_meme3, captions1);
//testRound(roundOr);
//testRoundID();
//testPostMatch(match1);
//testGetMatch(1);
