const { ObjectID } = require('mongodb');
const database = require('../database');

async function create(name, ingredients, preparation) {
    this.name = name;
    this.ingredients = ingredients;
    this.preparation = preparation;

    const db = await database.connect();
    console.debug('Creating recipe');
    const res = await db.collection('recipes').insertOne(this);
    this._id = res.insertedId;
    console.log('Recipe created', this);
}

async function getAll() {
    console.log('Geting all recipes');
    const db = await database.connect();
    const res = await db.collection('recipes').find({});
    return res;
}

async function findById(id) {
    console.log('Find recipe');
    const db = await database.connect();
    
    let res = null;
    try {
        const oId = ObjectID(id);
        res = await db.collection('recipes').findOne({ _id: oId });
    } catch (e) {
        console.log(e);
    }

    return res;
}

module.exports = {
    create,
    findById,
    getAll,
};