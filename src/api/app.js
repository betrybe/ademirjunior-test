const express = require('express');
const path = require('path');

const app = express();

const uploadPath = path.join(__dirname, '..', 'uploads');

app.use('/images', express.static(uploadPath));

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

app.use('/', require('./auth/routes'));
app.use('/', require('./users/routes'));
app.use('/', require('./recipes/routes'));

module.exports = {
  app,
  uploadPath,
};
