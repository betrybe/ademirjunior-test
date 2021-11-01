const sinon = require('sinon');
const { expect } = require('chai');
const user = require('../api/users/user');
const database = require('../api/database');
const controllers = require('../api/auth/controllers');

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

let userDto;

describe('Auth constrollers', () => {
    before(async () => {
        db = await database.connect();
        
        await db.collection('users').deleteMany({});
        userDto = await user.create('Nuno', 'nuno@gg.com', '123');
        userDto.password = '123';
    });

    after(async () => {
        await db.close;
    });

    it('Controller login correto de usuário', async () =>{
        const req = {
            body: {
                email: userDto.email,
                password: userDto.password,
            }
        };

        let res = new Res();
        await controllers.login(req, res);

        expect(res.codeStatus).to.be.equals(200);
        expect(res.body).to.have.property('token');
    });

    it('Controller login não pode passar sem senha', async () =>{
        let req = {
            body: {
                email: userDto.email,
            }
        };

        let res = new Res();
        await controllers.login(req, res);

        expect(res.codeStatus).to.be.equals(401);
        expect(res.body.message).to.be.equals('All fields must be filled');
    });

    it('Controller login não pode passar sem email', async () =>{
        let req = {
            body: {
                password: userDto.password,
            }
        };

        let res = new Res();
        await controllers.login(req, res);

        expect(res.codeStatus).to.be.equals(401);
        expect(res.body.message).to.be.equals('All fields must be filled');
    });

    it('Controller login não pode passar com senha errada', async () =>{
        let req = {
            body: {
                email: userDto.email,
                password: '02020202',
            }
        };

        let res = new Res();
        await controllers.login(req, res);

        expect(res.codeStatus).to.be.equals(401);
        expect(res.body.message).to.be.equals('Incorrect username or password');
    });
});