const { MongoClient } = require('mongodb');

const MONGO_DB_URL = 'mongodb://localhost:27017/Cookmaster';
const DB_NAME = 'Cookmaster';

async function connect() {
    const conn = await MongoClient.connect(MONGO_DB_URL, { 
      useNewUrlParser: true,
      useUnifiedTopology: true, 
    });

    return conn.db(DB_NAME);
}

module.exports = {
    connect,
};