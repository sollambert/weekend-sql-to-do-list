const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

router.get('/',(req, res) => {
        let query = `SELECT * FROM tasks`;
        pool.query(query)
        .then((dbRes) => {
                res.send(dbRes.rows);
        })
        .catch((err) => {
                console.log(err);
                res.sendStatus(500);
        })
});

router.post('/', (req, res) => {
        let query = `
        INSERT INTO tasks (taskname, taskdesc, complete, timecomplete)
        VALUES ($1, $2, false, null)`;
        let params = [req.body.name, req.body.desc];
        pool.query(query, params)
        .then((dbRes) => {
                res.sendStatus(201);
        })
        .catch((err) => {
                console.log(err);
                res.sendStatus(500);
        });
});

router.delete('/', () => {

});

router.put('/', () => {

});

module.exports = router;