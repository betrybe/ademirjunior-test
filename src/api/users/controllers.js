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
        response.status(400).json({ message: 'Invalid entries. Try again.' });
        return false;
    }

    user.emailExists(request.body.email)
        .then(async (exist) => {
            if (exist) {
                response.status(409).json({ message: 'Email already registered' });
                return false;
            }

            user.create(request.body.name, request.body.email, request.body.password)
            .then((userDto) => {
                response.status(201).json({ user: userDto });    
            });        
        })
        .catch((e) => console.log(e));
}

async function storeAdmin(request, response) {
    if (!validInputStore(request)) {
        return response.status(400).json({ message: 'Invalid entries. Try again.' });
    }

    if (request.userLogged.role !== 'admin') {
        return response.status(403).json({ message: 'Only admins can register new admins' });
    }

    user.emailExists(request.body.email)
        .then(async (exist) => {
            if (exist) {
                return response.status(409).json({ message: 'Email already registered' });
            }

            user.createAdmin(request.body.name, request.body.email, request.body.password)
                .then((userDto) => response.status(201).json({ user: userDto }));
        }).catch((e) => console.log(e));
}

module.exports = {
    store,
    storeAdmin,
};