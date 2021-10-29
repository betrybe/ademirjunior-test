const database = require('../database');

async function create(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = 'user';

    const db = await database.connect();
    console.debug('Creating user');
    const res = await db.collection('users').insertOne(this);
    // eslint-disable-next-line no-underscore-dangle
    this._id = res.insertedId;
}

async function createAdmin(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = 'admin';

    const db = await database.connect();
    console.debug('Creating user admin');
    const res = await db.collection('users').insertOne(this);
    this._id = res.insertedId;
}

async function emailExists(email) {
    const db = await database.connect();
    const count = await db.collection('users').countDocuments({ email });
    return count > 0;
}

module.exports = {
    create,
    createAdmin,
    emailExists,
};