const { expect, use } = require('chai');
const { uploadPath } = require('../api/app');
const database = require('../api/database');
const recipe = require('../api/recipes/recipe');

let user;

describe('Recipe service', () => {
    before(async () => {
      db = await database.connect();
        
      await db.collection('recipes').deleteMany({});

      user = {
          _id: '123456789012',
          name: 'Usuário teste',
          email: 'teste@gg.com',
          role: 'user',
      };
    });

    after(async () => {
        await db.close;
    });

    it('Inserir receita no banco', async () => {
      const rec = await recipe.create('Omelete especial', 'ovos, queijo, pimenta, whisky', 
          'Quebre e misture os ovos, adicione a pimenta e o queijo, sirva o whisky e beba', user._id);

      expect(rec).to.have.property('_id');
    });

    it('Recuperar todas as receitas do banco', async () => {
      let rec = await recipe.create('Omelete comum', 'ovos, queijo, pimenta', 
            'Quebre e misture os ovos, adicione a pimenta e o queijo', user._id);

      rec = await recipe.getAll();
      const arr = await rec.toArray();
      expect(await arr.length).to.be.greaterThan(0);
    });

    it('Recuperar uma a receita do banco', async () => {
      let rec = await recipe.create('Frango alho poró', 'frango, alho poró', 
            'Tempere o frangpo  e asse por 40 min', user._id);

      let recCheck = await recipe.findById(await rec._id);
      expect(await recCheck._id.equals(rec._id)).to.be.equal(true);
    });

    it('Tentar receita recuperar com id inexistente', async () => {
      let recCheck = await recipe.findById('123456789012');
      expect(await recCheck).to.be.null;
    });

    it('Tentar recuperar receita com objectId inválido', async () => {
      let recCheck = await recipe.findById('1234567890');
      expect(await recCheck).to.be.null;
    });

    it('Atualizar uma receita do banco como admin', async () => {
      let rec = await recipe.create('Feijão', 'feijão preto', 
            'Cozinhe o feijão', user._id);

      let recCheck = await recipe.findById(await rec._id);
      recCheck.name = 'editado';

      await recipe.update(recCheck._id, recCheck, { role: 'admin' });

      recCheck = await recipe.findById(await rec._id);

      expect(await recCheck.name).to.be.equal('editado');
    });

    it('Atualizar uma receita do banco como admin', async () => {
      let rec = await recipe.create('Feijão', 'feijão preto', 
            'Cozinhe o feijão', user._id);

      let recCheck = await recipe.findById(await rec._id);
      recCheck.name = 'editado';

      await recipe.update(recCheck._id, recCheck, { role: 'admin' });

      recCheck = await recipe.findById(await rec._id);

      expect(await recCheck.name).to.be.equal('editado');
    });

    it('Atualizar uma receita do banco como dono', async () => {
      let rec = await recipe.create('Feijão branco', 'feijão branco', 
            'Cozinhe o feijão', user._id);

      let recCheck = await recipe.findById(await rec._id);
      recCheck.name = 'editado';

      await recipe.update(recCheck._id, recCheck, user);

      recCheck = await recipe.findById(await rec._id);

      expect(await recCheck.name).to.be.equal('editado');
    });

    it('Não deixar atualizar uma a receita se não for dono ou admin', async () => {
      let rec = await recipe.create('Arroz', 'arroz', 
            'Cozinhe o arroz', user._id);

      try {
        await recipe.update(rec._id, rec, { _id: '000000000000', role: 'user' });
      } catch (err) {
        return expect(err.message).to.be.equals('Must be admin or owner');
      }
    });

    it('Excluir uma a receita do banco como admin', async () => {
      let rec = await recipe.create('Receita ruim', 'ingredientes baratos', 
            'Tudo de segunda', user._id);

      await recipe.remove(rec._id, { role: 'admin' });

      recCheck = await recipe.findById(await rec._id);

      expect(await recCheck).to.be.equal(null);
    });

    it('Excluir uma a receita do banco como dono', async () => {
      let rec = await recipe.create('Receita mais ou menos', 'ingredientes baratos', 
            'Tudo de segunda', user._id);

      await recipe.remove(rec._id, user);

      recCheck = await recipe.findById(await rec._id);

      expect(await recCheck).to.be.equal(null);
    });

    it('Não deixar excluir uma a receita se não for dono ou admin', async () => {
      let rec = await recipe.create('Mais uma receita mais ou menos', 'ingredientes baratos', 
            'Tudo de segunda', user._id);

      try {
        await recipe.remove(rec._id, { _id: '000000000000', role: 'user' });
      } catch (err) {
        return expect(err.message).to.be.equals('Must be admin or owner');
      }
    });


    it('Atualizar campo de upload de uma imagem no banco como dono e admin', async () => {
      let rec = await recipe.create('Receita bonita com imagem', 'só coisa boa', 
            'Cozinhe com carinho', user._id);

      await recipe.updateImageField(rec._id, uploadPath, 'Dumb name owner' , user);

      recCheck = await recipe.findById(await rec._id);

      expect(await recCheck.image).to.be.equal(`${uploadPath}/Dumb name owner`);

      await recipe.updateImageField(rec._id, uploadPath, 'Dumb name admin' , { role: 'admin' });

      recCheck = await recipe.findById(await rec._id);

      expect(await recCheck.image).to.be.equal(`${uploadPath}/Dumb name admin`);
    });

    it('Não deixa atualizar campo de upload de uma imagem se não for dono ou admin', async () => {
      let rec = await recipe.create('Receita mais uma sem imagem', 'só coisa boa', 
            'Cozinhe com carinho', user._id);

      try {
        await recipe.updateImageField(rec._id, uploadPath, 'Dumb name owner' , {_id: '000000000000', role: 'user' });
      } catch (err) {
        return expect(err.message).to.be.equals('Must be admin or owner');
      }
    });
  });
