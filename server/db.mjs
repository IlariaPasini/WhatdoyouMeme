import sqlite from 'sqlite3';


//apriamo il database
const db = new sqlite.Database('Games.db', (err) => {
    if (err) throw err;
  });

  export default db;