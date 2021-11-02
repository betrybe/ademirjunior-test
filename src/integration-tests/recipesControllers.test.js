const { expect } = require('chai');
const user = require('../api/users/user');
const recipe = require('../api/recipes/recipe');
const database = require('../api/database');
const controllers = require('../api/recipes/controllers');

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
let userDto;

describe('Users constrollers', () => {
    before(async () => {
        db = await database.connect();
        
        await db.collection('recipes').deleteMany({});
        await db.collection('users').deleteMany({});
        adminDto = await user.createAdmin('Administrador', 'admin@gg.com', '321');
        userDto = await user.create('Nuno', 'nuno@gg.com', '123');
    });

    after(async () => {
        await db.close;
    });

    it('Controller create recipe', async () => {
        const req = {
            body: {
                name: 'Super receita de frango',
                ingredients: 'frango caipira, limão, sal, pimenta',
                preparation: 'Misture tudo e asse',
            },
            userLogged: userDto,
        }

        let res = new Res();
        await controllers.store(req, res)
            .then( () => {
                expect(res.codeStatus).to.be.equals(201);
                expect(res.body).to.have.property('recipe')
                    .that.have.property('userId')
                    .that.is.equals(userDto._id);
        });
    });

    it('Controller create recipe não passa sem nome', async () => {
        const req = {
            body: {
                ingredients: 'frango caipira, limão, sal, pimenta',
                preparation: 'Misture tudo e asse',
            },
            userLogged: userDto,
        }

        let res = new Res();
        await controllers.store(req, res)
            .then( () => {
                expect(res.codeStatus).to.be.equals(400);
                expect(res.body).to.have.property('message')
                    .that.is.equals('Invalid entries. Try again.');
        });
    });

    it('Controller create recipe não passa sem ingredients', async () => {
        const req = {
            body: {
                name: 'Frango especial',
                preparation: 'Misture tudo e asse',
            },
            userLogged: userDto,
        }

        let res = new Res();
        await controllers.store(req, res)
            .then( () => {
                expect(res.codeStatus).to.be.equals(400);
                expect(res.body).to.have.property('message')
                    .that.is.equals('Invalid entries. Try again.');
        });
    });


    it('Controller create recipe não passa sem preparação', async () => {
        const req = {
            body: {
                name: 'Frango especial',
                ingredients: 'frango',
            },
            userLogged: userDto,
        }

        let res = new Res();
        await controllers.store(req, res)
            .then( () => {
                expect(res.codeStatus).to.be.equals(400);
                expect(res.body).to.have.property('message')
                    .that.is.equals('Invalid entries. Try again.');
        });
    });

    it('Controller getOne recipe', async () => {
        const rec = await recipe.create('Receita de mignon', 'mignon', 'joga no fogo', userDto._id);
        const req = {
            params: {
                id: rec._id,
            },
            userLogged: userDto,
        }

        let res = new Res();
        await controllers.getOne(req, res)
            .then( () => {
                expect(res.codeStatus).to.be.equals(200);
                expect(res.body).to.have.property('name')
                    .that.is.equals(rec.name);
        });
    });

    it('Controller getOne recipe not found', async () => {
        const req = {
            params: {
                id: '123456789012',
            },
            userLogged: userDto,
        }

        let res = new Res();
        await controllers.getOne(req, res)
            .then( () => {
                expect(res.codeStatus).to.be.equals(404);
        });
    });

    it('Controller getAll', async () => {
        const req = {
            userLogged: userDto,
        }

        let res = new Res();
        await controllers.getAll(req, res)
            .then( () => {
                expect(res.codeStatus).to.be.equals(200);
                expect(res.body.length).to.be.greaterThan(0);
        });
    });

    it('Controller recipe update', async () => {
        let rec = await recipe.create('Receita meia boca', 'coxão duro', 'joga no fogo', '123456789012');

        rec.name= 'Receita alterada para muito boa';
        rec.ingredients= 'coxão mole';

        const req = {
            params: {
                id: rec._id,
            },
            body: rec,
            userLogged: { _id: '123456789012' },
        }

        let res = new Res();
        const result = await controllers.update(req, res);
        expect(res.codeStatus).to.be.equals(200);
        expect(res.body.name).to.be.equals('Receita alterada para muito boa');
        
    });

    it('Controller recipe update admin', async () => {
        let rec = await recipe.create('Receita meia boca', 'coxão duro', 'joga no fogo', userDto._id);

        rec.name= 'Receita alterada para muito boa';
        rec.ingredients= 'coxão mole';

        const req = {
            params: {
                id: rec._id,
            },
            body: rec,
            userLogged: { role: 'admin' },
        }

        let res = new Res();
        await controllers.update(req, res)
            .then( () => {
                expect(res.codeStatus).to.be.equals(200);
                expect(res.body.name).to.be.equals('Receita alterada para muito boa');
        });
    });

    it('Controller recipe remove', async () => {
        let rec = await recipe.create('Jiló', 'jiló verde', 'joga no fogo', '123456789012');

        const req = {
            params: {
                id: rec._id,
            },
            userLogged: { _id: '123456789012' },
        }

        let res = new Res();
        const result = await controllers.remove(req, res);
        expect(res.codeStatus).to.be.equals(204);
        
    });

    it('Controller recipe update imageField', async () => {
        let rec = await recipe.create('Receita com imagem', 'pimentão', 'joga no fogo', '123456789012');

        const req = {
            headers: {
                host: 'http://localhost:3000',
            },
            params: {
                id: rec._id,
            },
            file: {
                filename: '123456789012.png',
            },
            userLogged: { _id: '123456789012' },
        }

        let res = new Res();
        const result = await controllers.updateImageField(req, res);
        expect(res.codeStatus).to.be.equals(200);
        expect(res.body).has.a.property('image');
        
    });

});