import dayjs from 'dayjs';

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

function Round(id, id_match, id_meme, id_caption, data){
    this.id = id;
    this.id_match = id_match;
    this.id_meme = id_meme;
    this.id_caption = id_caption;
    this.data = dayjs(data);
}
export {Caption, Meme, Match, Round};