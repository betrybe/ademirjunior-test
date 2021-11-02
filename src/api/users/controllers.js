const validations = require('../../helpers/validations');
const user = require('./user');

function validInputStore(request) {
    let valid = true;
    
    valid = valid && request.body.name;
    valid = valid && request.body.email;
    valid = valid && validations.isEmail(request.body.email);
    valid = valid && request.body.password;

    return valid;
}

async function store(request, response) {
    if (!validInputStore(request)) {
        return response.status(400).json({ message: 'Invalid entries. Try again.' });
    }

    const exist = await user.emailExists(request.body.email);
    if (exist) {
        return response.status(409).json({ message: 'Email already registered' });
    }

    const userDto = await user.create(request.body.name, request.body.email, request.body.password);
    return response.status(201).json({ user: userDto });    
}

async function storeAdmin(request, response) {
    if (!validInputStore(request)) {
        return response.status(400).json({ message: 'Invalid entries. Try again.' });
    }

    if (request.userLogged.role !== 'admin') {
        return response.status(403).json({ message: 'Only admins can register new admins' });
    }

    const exist = await user.emailExists(request.body.email);
    if (exist) {
        return response.status(409).json({ message: 'Email already registered' });
    }

    const b = request.body;
    const userDto = await user.createAdmin(b.name, b.email, b.password);
    return response.status(201).json({ user: userDto });
}

module.exports = {
    store,
    storeAdmin,
};