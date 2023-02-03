const pg = require('pg'); //importing the PG dependency

//pool represents a network connection to db
//we call pool.query to query db
const pool = new pg.Pool({
        //Name DB
        database: 'weekend-to-do-app',
        //host
        host: 'localhost',
        //port. default: 5432
        port: 5432,
        //user: 'postgres',
        //password
        //password: 'password'
});

module.exports = pool;