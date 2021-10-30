const { expect } = require('chai');
const user = require('../api/users/user');
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
