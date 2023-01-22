const express = require('express');
const { connectToDb, getDb } = require('./db');
const { ObjectId } = require('mongodb');

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
        .sort({ name: 1 })
        .forEach(name => termScores.push(name))
        .then(() => {
            res.status(200).json(termScores);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Could not fetch documents' });
        })
})

//find an employee by their ID
app.get('/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        db.collection('termScores')
            .findOne({ _id: ObjectId(req.params.id) })
            .then(doc => {
                res.status(200).json(doc)
            })
            .catch(() => {
                res.status(500).json({ error: 'Could not fetch documents' })
            })
    } else {
        res.status(500).json({ error: "Not a valid ID" })
    }
})

//see list of employees who failed Foundation term
app.get('/results/foundation', async (req, res) => {

    try {
        const termScores = await db.collection("termScores").find({}).toArray();
        const persons = [];
        for (const person of termScores) {
            for (const result of person.results) {
                if (result.term === "Foundation" && result.score < 37) {
                    persons.push("Failed Foundation:", person.name);
                    persons.push(person.results);
                }
            }
        }
        return res.status(200).json(persons);
    }
    catch {
        res.status(500).json({ error: 'Could not fetch documents' });
    }
})

//see list of employees who failed Advanced term
app.get('/results/advanced', async (req, res) => {

    try {
        const termScores = await db.collection("termScores").find({}).toArray();
        const persons = [];
        for (const person of termScores) {
            for (const result of person.results) {
                if (result.term === "Advanced" && result.score < 37) {
                    persons.push("Failed Advanced:", person.name);
                    persons.push(person.results);
                }
            }
        }
        return res.status(200).json(persons);
    }
    catch {
        res.status(500).json({ error: 'Could not fetch documents' });
    }
})

//list of employees with total score under 111 marks (failed)
app.get('/results/failed', async (req, res) => {

    try {
        const termScores = await db.collection("termScores").find({}).toArray();
        const persons = [];
        for (let person of termScores) {
            let sum = 0;
            for (const result of person.results) {
                sum += result.score;
            }
            if (sum < 111) {
                persons.push(person.name + " Got a total score of " + sum);
            }
        }
        return res.status(200).json(persons);
    }
    catch {
        res.status(500).json({ error: 'Could not fetch documents' });
    }
})

//list of employees with their average score in total
app.get('/results/average', async (req, res) => {

    try {
        const termScores = await db.collection("termScores").find({}).toArray();
        const persons = [];
        for (let person of termScores) {
            let sum = 0;
            for (const result of person.results) {
                sum += result.score;
            }
            let average = Math.floor(sum / 3);
            persons.push(person.name + " Got an average score of " + average);
        }
        return res.status(200).json(persons);
    }
    catch {
        res.status(500).json({ error: 'Could not fetch documents' });
    }
})
