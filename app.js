const express = require('express');
const { connectToDb, getDb } = require('./db');

const app = express();
const PORT = 3000;

//db connection
let db
connectToDb((err) => {
    if (!err) {
        app.listen(PORT, () => {
            console.log(`app listening on port ${PORT}`)
        });
        db = getDb();
    }
})

//see all employee results, 37/100 marks minimum to pass each term
//there are 3 terms, foundation, intermediate and advanced
app.get('/results', (req, res) => {

    let termScores = [];

    db.collection('termScores')
    .find()
    .sort({name: 1})
    .forEach(name => termScores.push(name))
    .then(() => {
        res.status(200).json(termScores);
    })
    .catch(() => {
        res.status(500).json({error: 'Could not fetch documents'})
    })
})

//see percentage of employees who failed Foundation term
//app.get()

//list of employees with total score under 111 marks (failed)
//app.get()

//average score of all employees on Foundation term
//app.get()

//list of employees with their average score in total
//app.get()

//total of employees who failed each term (less than 37 marks for all terms)
//app.get()

//total of employees who failed in at least one term
//app.get()