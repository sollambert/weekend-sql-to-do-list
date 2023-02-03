const express = require('express');
const app = express();
const tasksRouter = require('./routes/tasks.router.js')

app.use(express.static('server/public'));
app.use(express.urlencoded({extended: true}));
app.use('/tasks', tasksRouter);

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
        console.log(``)
});