const { ObjectID } = require('mongodb');
const database = require('../database');

async function create(name, email, password) {
    const userDto = {
        name,
        email,
        password,
        role: 'user',
    };

    const db = await database.connect();
    console.debug('Creating user');
    await db.collection('users').insertOne(userDto);
    delete userDto.password; // não expor a senha
    console.log('User created', await userDto);
    return userDto;    
}

async function createAdmin(name, email, password) {
    const userDto = {
        name,
        email,
        password,
        role: 'admin',
    };

    const db = await database.connect();
    console.debug('Creating user admin');
    await db.collection('users').insertOne(userDto);
    delete userDto.password; // não expor a senha
    console.log('Admin created', await userDto._id);
    return userDto;        
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