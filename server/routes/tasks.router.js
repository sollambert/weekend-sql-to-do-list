const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

router.get('/',(req, res) => {
        let query = `SELECT * FROM tasks
        ORDER BY id`;
        pool.query(query)
        .then((dbRes) => {
                res.send(dbRes.rows);
        })
        .catch((err) => {
                console.log(err);
                res.sendStatus(500);
        })
});

router.get('/:id',(req, res) => {
        let query = `SELECT subtasks FROM tasks
        WHERE id=$1`;
        let params = [req.params.id];
        pool.query(query,params)
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
        INSERT INTO tasks (taskname, taskdesc, subtasks, timecomplete)
        VALUES ($1, $2, $3, null)`;
        let params = [req.body.name, req.body.desc, req.body.subtasks];
        pool.query(query, params)
        .then((dbRes) => {
                res.sendStatus(201);
        })
        .catch((err) => {
                console.log(err);
                res.sendStatus(500);
        });
});

router.delete('/:id', (req, res) => {
        let query = `DELETE FROM tasks
        WHERE id=$1`;
        let params = [req.params.id];
        pool.query(query, params)
        .then((dbRes) => {
                res.sendStatus(204);
        })
        .catch((err) => {
                console.log(err);
                res.sendStatus(500);
        })
});

router.put('/:id', (req, res) => {
        let query = `UPDATE tasks
        SET timecomplete=$2
        WHERE id=$1`;
        let params = [];
        if (req.body.timecomplete) {
                params = [req.params.id, req.body.timecomplete];
        } else {
                params = [req.params.id, null]
        }
        pool.query(query, params)
        .then((dbRes) => {
                res.sendStatus(204);
        })
        .catch((err) => {
                console.log(err);
                res.sendStatus(500);
        })
});

router.put('/subs/:id', (req, res) => {
        let query = `UPDATE tasks
        SET subtasks=$2
        WHERE id=$1`;
        let params = [req.params.id, req.body.subtasks];
        pool.query(query, params)
        .then((dbRes) => {
                res.sendStatus(204);
        })
        .catch((err) => {
                console.log(err);
                res.sendStatus(500);
        })
});

module.exports = router;