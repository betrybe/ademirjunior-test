const { expect } = require('chai');
const user = require('../api/users/user');
const database = require('../api/database');
const controllers = require('../api/users/controllers');

let Res = function() {
    this.codeStatus= 200,
    this.body= {},
    this.json= (content) =>{
        this.body = content;
        return this;
    };
    this.status= (code) =>{ 
        this.codeStatus = code;
        return this;
    };
};

let adminDto;

describe('Users constrollers', () => {
    before(async () => {
        db = await database.connect();
        
        await db.collection('users').deleteMany({});
        adminDto = await user.createAdmin('Administrador', 'admin@gg.com', '321');
    });

    after(async () => {
        await db.close;
    });

    it('Controller create usuário', async () => {
        const req = {
            body: {
                name: 'Nuno',
                email: 'nuno@gg.com',
                password: '123',
            }
        }

        let res = new Res();
        await controllers.store(req, res)
            .then( () => {
                expect(res.codeStatus).to.be.equals(201);
                expect(res.body).to.have.property('user')
                    .that.have.property('role')
                    .that.is.equal('user');
        });
    });

    it('Controller create usuário sem nome não passa', async () => {
        const req = {
            body: {
                email: 'nuno@gg.com',
                password: '123',
            }
        }

        let res = new Res();
        await controllers.store(req, res)
            .then( () => {
                expect(res.codeStatus).to.be.equals(400);
                expect(res.body).to.have.property('message')
                    .that.is.equal('Invalid entries. Try again.');
        });
    });

    it('Controller create usuário sem email não passa', async () => {
        const req = {
            body: {
                name: 'Nuno',
                password: '123',
            }
        }

        let res = new Res();
        await controllers.store(req, res)
            .then( () => {
                expect(res.codeStatus).to.be.equals(400);
                expect(res.body).to.have.property('message')
                    .that.is.equal('Invalid entries. Try again.');
        });
    });

    it('Controller create usuário sem senha não passa', async () => {
        const req = {
            body: {
                name: 'Nuno',
                email: 'qualqueremail@gg.com'
            }
        }

        let res = new Res();
        await controllers.store(req, res)
            .then( () => {
                expect(res.codeStatus).to.be.equals(400);
                expect(res.body).to.have.property('message')
                    .that.is.equal('Invalid entries. Try again.');
        });
    });

    it('Controller create usuário email repetido não passa', async () => {
        const req = {
            body: {
                name: 'Nuno',
                email: 'nuno@gg.com',
                password: '123',
            }
        }

        let res = new Res();
        await controllers.store(req, res)
            .then( () => {
                expect(res.codeStatus).to.be.equals(409);
                expect(res.body).to.have.property('message')
                    .that.is.equal('Email already registered');
        });
    });

    it('Controller create admin', async () => {
        const req = {
            body: {
                name: 'Novo adm',
                email: 'novo-adm@gg.com',
                password: '987',
            },
            userLogged: adminDto,
        }

        let res = new Res();
        await controllers.storeAdmin(req, res)
            .then( () => {
                expect(res.codeStatus).to.be.equals(201);
                expect(res.body).to.have.property('user')
                    .that.have.property('role')
                    .that.is.equal('admin');
        });
    });

    it('Controller create admin somente se usuário é admin', async () => {
        const req = {
            body: {
                name: 'Novo adm',
                email: 'novo-adm@gg.com',
                password: '987',
            },
            userLogged: { role: 'user' },
        }

        let res = new Res();
        await controllers.storeAdmin(req, res)
            .then( () => {
                expect(res.codeStatus).to.be.equals(403);
                expect(res.body).to.have.property('message')
                    .that.is.equal('Only admins can register new admins');
        });
    });

    it('Controller create admin sem nome não passa', async () => {
        const req = {
            body: {
                email: 'novo-adm@gg.com',
                password: '987',
            },
            userLogged: adminDto,
        }

        let res = new Res();
        await controllers.storeAdmin(req, res)
            .then( () => {
                expect(res.codeStatus).to.be.equals(400);
                expect(res.body).to.have.property('message')
                    .that.is.equal('Invalid entries. Try again.');
        });
    });

    it('Controller create admin sem email não passa', async () => {
        const req = {
            body: {
                name: 'Mais admin',
                password: '987',
            },
            userLogged: adminDto,
        }

        let res = new Res();
        await controllers.storeAdmin(req, res)
            .then( () => {
                expect(res.codeStatus).to.be.equals(400);
                expect(res.body).to.have.property('message')
                    .that.is.equal('Invalid entries. Try again.');
        });
    });

    it('Controller create admin sem senha não passa', async () => {
        const req = {
            body: {
                name: 'Mais admin',
                email: 'maisumadmin@cc.com',
            },
            userLogged: adminDto,
        }

        let res = new Res();
        await controllers.storeAdmin(req, res)
            .then( () => {
                expect(res.codeStatus).to.be.equals(400);
                expect(res.body).to.have.property('message')
                    .that.is.equal('Invalid entries. Try again.');
        });
    });

    it('Controller create admin email repetido não passa', async () => {
        const req = {
            body: {
                name: 'Novo adm',
                email: 'novo-adm@gg.com',
                password: '987',
            },
            userLogged: adminDto,
        }

        let res = new Res();
        await controllers.storeAdmin(req, res)
            .then( () => {
                expect(res.codeStatus).to.be.equals(409);
                expect(res.body).to.have.property('message')
                    .that.is.equal('Email already registered');
        });
    });
});