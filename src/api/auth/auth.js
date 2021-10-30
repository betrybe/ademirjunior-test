const jwt = require('jsonwebtoken');
const jwtAuth = require('./jwt');
const database = require('../database');

async function login(email, password) {
    const db = await database.connect();
    console.debug('Logging user');
    const res = await db.collection('users').findOne({
        email,
        password,
    }, {
        projection: { name: 1, email: 1, role: 1 },
    });
    
    if (res == null) {
        throw Error('Incorrect username or password');
    }

    const token = jwt.sign({ userLogged: res }, jwtAuth.secretKey, {
        expiresIn: 300,
      });

    return token;
}


module.exports = {
    login,
};