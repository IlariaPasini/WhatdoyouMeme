import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import {check, validationResult} from 'express-validator';
import {  getMeme, getRoundID, listCaptionsRandom, listMatchesID, addRound, postMatch, getCaptionsID} from './dao.mjs';
import { getUser } from './userDao.mjs';

// Passport-related imports -- NEW
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

// init
const app = express();
const port = 3001;

// per avere le immagini statiche
app.use(express.static('img_meme'));



// middleware
app.use(express.json());
app.use(morgan('dev'));
// set up and enable CORS -- UPDATED
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));


// Passport: set up local strategy -- NEW
passport.use(new LocalStrategy(async function verify(username, password, cb) {
    const user = await getUser(username, password);
    if(!user)
      return cb(null, false, 'Incorrect username or password.');
      
    return cb(null, user);
  }));
  
  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function (user, cb) { // this user is id + email + name
    return cb(null, user);
    // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
  });
  
  const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({error: 'Not authorized'});
  }
  
  app.use(session({
    secret: "shhhhh... it's a secret!",
    resave: false,
    saveUninitialized: false,
  }));
  app.use(passport.authenticate('session'));
  

// GET /api/user/<id>/matchID
//permette di ottenere la lista delle partite giocate da un utente
app.get('/api/user/:id/matchID', async (request, response) => {
  try {
    

    const matches = await listMatchesID(request.params.id);
    if(matches.error){
        response.status(404).json(matches);
    }else{
        response.json(matches);
    }
} catch (err) {
    response.status(500).end();
   }
  });

  // POST /api/user/<id>/match
  //permette di creare una nuova partita collegata al gioatore

app.post('/api/user/:id/match', isLoggedIn, async (request, response) => {
    const errors = validationResult(request);

    if(!errors.isEmpty()){
        return response.status(400).json({errors: errors.array()});
    }

    try {

        const matches = await postMatch(request.body.id_utente, request.body.score);
        response.json(matches);
        //inserire quando c'è un errore
    } catch (err) {
        response.status(500).end();
    }
});


// GET /api/memes/<id>
//permette di ottenere un meme in base all'id
app.get('/api/memes/:id', async (request, response) => {
    try {
        const meme = await getMeme(request.params.id);
        if(meme.error){
            response.status(404).json(meme);
        }else{
            response.json(meme);
        }
    } catch (err) {
        response.status(500).end();
    }
});

// GET /api/memes
//permette di ottenere la lista di tutti i meme
app.get('/api/memes', async (request, response) => {
    try {
        const memes = await listMemes();
        response.json(memes);
    } catch (err) {
        response.status(500).end();
    }
});


//GET api/memes/<id>/captions

app.get('/api/memes/:id/captions', async (request, response) => {
    try {
        const captions = await listCaptionsRandom(request.params.id);
        if(captions.error){
            response.status(404).json(captions);
        }else{
            response.json(captions);
        }
    } catch (err) {
        response.status(500).end();
    }
});



//GET api/memes/<id>/captions per quell'id


app.post('/api/meme/:id/captionsId', async (req, res) => {

    try{
      const captions = await getCaptionsID(req.params.id, req.body.captions);
      res.json(captions);
    } catch {
      res.status(500).json('Internal server error');
    }
  });
  
  //POST /api/user/<id>/match
  app.post('/api/user/:id/match', isLoggedIn, async (req, res) => {
    try{
      const match = await postMatch(req.params.id, req.body.score);
      res.json(match);
    } catch {
      res.status(500).json('Internal server error');
    }
  });


  //POST /api/user/<id>/match/<id>/round
  app.post('/api/user/:id/match/:id_match/round', isLoggedIn, async (req, res) => {
   
    try{
      const round = await addRound(req.body);
     // console.log(round);
      res.json(round);
    } catch {
      res.status(500).json('Internal server error');
    }
  });

  //GET /api/match/<id>/rounds
  app.get('/api/match/:id/rounds', async (req, res) => {
    try{
      const rounds = await getRoundID(req.params.id);
      
      res.json(rounds);
    } catch {
      res.status(500).json('Internal server error');
    }
  });

// POST /api/sessions -- NEW
app.post('/api/sessions', function(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err)
        return next(err);
        if (!user) {
          // display wrong login messages
         // return res.status(401).send(info);
        }
        // success, perform the login
        req.login(user, (err) => {
          if (err)
            return next(err);
          
          // req.user contains the authenticated user, we send all the user info back
          return res.status(201).json(req.user);
        });
    })(req, res, next);
  });
  
  /* If we aren't interested in sending error messages... */
  /*app.post('/api/sessions', passport.authenticate('local'), (req, res) => {
    // req.user contains the authenticated user, we send all the user info back
    res.status(201).json(req.user);
  });*/
  
  // GET /api/sessions/current -- NEW
  app.get('/api/sessions/current', (req, res) => {
    if(req.isAuthenticated()) {
      res.json(req.user);}
    else
      res.status(401).json({error: 'Not authenticated'});
  });
  
// DELETE /api/session/current
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// per l'attivazione del server
app.listen(port, () => { console.log(`API server started at http://localhost:${port}`); });