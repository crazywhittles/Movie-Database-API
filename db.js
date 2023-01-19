const { MongoClient } = require('mongodb');

let dbConnection

//results is the db name in Mongodb, and the collection is termScores
module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect('mongodb://127.0.0.1:27017/results')
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