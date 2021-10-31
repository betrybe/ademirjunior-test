const { expect } = require('chai');
const user = require('../api/users/user');
const auth = require('../api/auth/auth');
const jwt = require('../api/auth/jwt');
const database = require('../api/database');

let db;

describe('User service', () => {
    before(async () => {
        db = await database.connect();
        
        await db.collection('users').deleteMany({});
    });

    after(async () => {
        await db.close;
    });

    it('Inserir usuário admin no banco usando o service User', async () => {
        const res = await user.createAdmin('Administrador', 'admin@gg.com', '321');

        expect(res.role).equal('admin');
    });

    it('Inserir usuário no banco usando o service User', async () => {
        const res = await user.create('Nuno', 'nuno@gg.com', '123');

        expect(res.role).equal('user');
    });

    it('Verificar que email já existe', async () => {
        expect(await user.emailExists('nuno@gg.com')).equal(true);
    });

});

describe('Auth service', () => {
    it('Login com sucesso do usuário', async ()=> {
        const token = await auth.login('nuno@gg.com', '123');
        
        const req = {
            headers: {
                authorization: token,
            }
        };

        jwt.isValid(req, null, () =>{});

        expect(req).to.have.property('userLogged');
    });

    it('Login com sucesso retorna usuário correto', async ()=> {
        const token = await auth.login('nuno@gg.com', '123');
        
        const req = {
            headers: {
                authorization: token,
            }
        };

        jwt.isValid(req, null, () =>{});

        expect(req.userLogged.email).to.be.equals('nuno@gg.com');
    });

    it('Login não acontece com email errado', async ()=> {
        try {
            await auth.login('nuno@gg.com.br', '123');
        } catch (error) {
            return expect(error.message).to.be.equals('Incorrect username or password');
        }
    });

    it('Login não acontece com senha errada', async ()=> {
        try {
            await auth.login('nuno@gg.com', '1123');
        } catch (error) {
            return expect(error.message).to.be.equals('Incorrect username or password');
        }
    });

});
