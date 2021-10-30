const { ObjectID } = require('mongodb');
const database = require('../database');

async function findById(id) {
    console.log('Find user');
    const db = await database.connect();
    
    let res = null;
    try {
        const oId = ObjectID(id);
        res = await db.collection('users').findOne({ _id: oId });
    } catch (e) {
        console.log(e);
    }

    return res;
}

async function create(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = 'user';

    const db = await database.connect();
    console.debug('Creating user');
    const res = await db.collection('users').insertOne(this);
    const u = await findById(res.insertedId);
    console.log('User created', await u._id);
    return u;    
}

async function createAdmin(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = 'admin';

    const db = await database.connect();
    console.debug('Creating user admin');
    const res = await db.collection('users').insertOne(this);
    const u = await findById(res.insertedId);
    console.log('Admin created', await u._id);
    return u;        
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