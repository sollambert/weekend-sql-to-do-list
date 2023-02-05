const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

/**
 * Route for recieving HTTP GET requests
 */
router.get('/',(req, res) => {
        let query = ``;
        let sortOrder = '';
        switch (req.query.order) {
                case 'id':
                        sortOrder = 'id';
                        break;
                case 'taskname':
                        sortOrder = 'taskname';
                        break;
                case 'timecomplete':
                        sortOrder = 'timecomplete';
                        break;
        }
        if (req.query.direction == 'ASC') {
                query = `SELECT * FROM tasks
                ORDER BY ${sortOrder} ASC;`
        } else {
                query = `SELECT * FROM tasks
                ORDER BY ${sortOrder} DESC;`
        }
        //let params = [req.query.order];
        //console.log(params)
        //console.log(query, params, req.query.direction)
        pool.query(query)
        .then((dbRes) => {
                //console.log(dbRes)
                res.send(dbRes.rows);
        })
        .catch((err) => {
                console.log(err);
                res.sendStatus(500);
        })
});

/**
 * Route for recieving HTTP GET requests specified by id
 */
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

/**
 * Route for recieving HTTP POST request
 */
router.post('/', (req, res) => {
        let query = `
        INSERT INTO tasks (taskname, taskdesc, subtasks, timecomplete)
        VALUES ($1, $2, $3, null);`;
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

/**
 * Route for recieving HTTP DELETE requests by ID
 */
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

/**
 * Route for recieving HTTP PUT requests by ID and updating the associated row in SQL with the provided timestamp
 */
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

/**
 * Route for handling HTTP PUT requests on /subs/:id route and applying persistent data for specified task subtasks
 */
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