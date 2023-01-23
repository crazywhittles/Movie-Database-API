const express = require('express');
const { connectToDb, getDb } = require('./db');
const { ObjectId } = require('mongodb');

const app = express();
//handle json requests
app.use(express.json());
const PORT = 4000;

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

//return all movies
app.get('/movie', (req, res) => {

    let movies = [];

    db.collection('movies')
        .find()
        .sort({ title: 1 })
        .forEach(name => movies.push(name))
        .then(() => {
            res.status(200).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Could not fetch documents' });
        })
})

//return movie by ID
app.get('/movie/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        db.collection('movies')
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

//POST request to add a new movie to db
app.post('/movie', (req, res) => {

    const movie = req.body;
    const title = req.body.title;
    const year = req.body.year;
    const plot = req.body.plot;
    const genres = req.body.genres;
    const rated = req.body.rated;
    const runtime = req.body.runtime;

    if (!title) {
        return res.status(418).json({ error: 'Missing Title' })
    }
    if (!year) {
        return res.status(418).json({ error: 'Missing Year' })
    }
    if (!plot) {
        return res.status(418).json({ error: 'Missing Plot' })
    }
    if (!genres) {
        return res.status(418).json({ error: 'Missing Genres' })
    }
    if (!rated) {
        return res.status(418).json({ error: 'Missing Rated' })
    }
    if (!runtime) {
        return res.status(418).json({ error: 'Missing Runtime' })
    }
    db.collection('movies')
        .insertOne(movie)
        .then(result => {
            res.status(201).json(result)
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Could not create new documment' });
        })
})

//update movie by ID
app.patch('/movie/:id', (req, res) => {

    const update = req.body;

    if (ObjectId.isValid(req.params.id)) {
        db.collection('movies')
            .updateOne({ _id: ObjectId(req.params.id) }, { $set: update })
            .then(result => {
                res.status(200).json(result)
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 'Could not fetch documents' });
            })
    } else {
        res.status(500).json({ error: "Not a valid ID" })
    }
})

//delete movie by ID
app.delete('/movie/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        db.collection('movies')
            .deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.status(200).json(result)
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 'Could not fetch documents' });
            })
    } else {
        res.status(500).json({ error: "Not a valid ID" })
    }
})

//return all genres in the db
app.get('/genres', async (req, res) => {

    try {
        const movies = await db.collection("movies").find({}).toArray();
        const genres = [];
        const dupes = (arr) => {
            return [...new Set(arr)];
        }

        for (const movie of movies) {
            for (const result of movie.genres) {
                genres.push(result);
            }
        }
        return res.status(200).json(dupes(genres));
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not fetch documents' });
    }
})
