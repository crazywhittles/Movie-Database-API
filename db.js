const { MongoClient } = require('mongodb');

let dbConnection

//movieDB is the db name in Mongodb, and the collection is called movies
//one movie is also in movie.json as an example
module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect('mongodb://127.0.0.1:27017/movieDB')
            .then((client) => {
                dbConnection = client.db()
                return cb()
            })
            .catch(err => {
                console.log(err)
                return cb(err)
            })
    },
    getDb: () => dbConnection
}