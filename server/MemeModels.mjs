import dayjs from "dayjs";

function Caption(id, text){
    this.id=id;
    this.text=text;
}


function Meme(id, Image){
this.id = id;
this.Image = Image;

}

function Match(id, data, points, id_utente){
    this.id = id;
    this.data = dayjs(data);
    this.points = points;
    this.id_utente = id_utente;
}

function Round(id_round, id_meme, id_caption, id_match,isCorrect){
    this.id_round = id_round;
    this.id_meme = id_meme;
    this.id_caption = id_caption;
    this.id_match = id_match;
    this.isCorrect = isCorrect ;
}
export {Caption, Meme, Match, Round};