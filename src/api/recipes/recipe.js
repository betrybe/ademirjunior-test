const { ObjectID } = require('mongodb');
const database = require('../database');

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

function mapDto(name, ingredients, preparation, userId) {
    return {
        name,
        ingredients,
        preparation,
        userId,
    };
}

async function create(name, ingredients, preparation, userId) {
    const dto = mapDto(name, ingredients, preparation, userId);

    const db = await database.connect();
    console.debug('Creating recipe');
    await db.collection('recipes').insertOne(dto);
    console.log('Recipe created', await dto._id);
    return dto;
}

async function getAll() {
    console.log('Geting all recipes');
    const db = await database.connect();
    const res = await db.collection('recipes').find({});
    return res;
}

async function isOwnerOrAdmin(id, userLogged) {
    const db = await database.connect();
    const oId = ObjectID(id);

    if (userLogged.role === 'admin') return true;

    const res = await db.collection('recipes').findOne({ _id: oId });
    if (await res.userId === userLogged._id) return true;

    return false;
}

async function update(id, data, userLogged) {
    console.log('Update recipe');

    if (await isOwnerOrAdmin(id, userLogged) === false) {
        throw Error('Must be admin or owner');
    }

    const db = await database.connect();
    
    const oId = ObjectID(id);

    const res = await db.collection('recipes').updateOne(
        { _id: oId },
        {
            $set: {
                name: data.name,
                ingredients: data.ingredients,
                preparation: data.preparation,
            },
        },
    );
    
    return res;    
}

async function updateImageField(id, path, fileName, userLogged) {
    console.log('Upload image');

    if (await isOwnerOrAdmin(id, userLogged) === false) {
        throw Error('Must be admin or owner');
    }

    const db = await database.connect();
    
    const oId = ObjectID(id);

    const res = await db.collection('recipes').updateOne(
        { _id: oId },
        {
            $set: {
                image: `${path}/${fileName}`,
            },
        },
    );
    
    return res;    
}

async function remove(id, userLogged) {
    console.log('Delete recipe');

    if (await isOwnerOrAdmin(id, userLogged) === false) {
        throw Error('Must be admin or owner');
    }

    const db = await database.connect();
    
    const oId = ObjectID(id);

    const res = await db.collection('recipes').deleteOne(
        { _id: oId },
    );
    
    return res;    
}

module.exports = {
    create,
    findById,
    getAll,
    remove,
    update,
    updateImageField,
};