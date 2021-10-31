const jwt = require('jsonwebtoken');

const secretKey = 'minha-chave-super-secreta';

function isValid(request, response, next) {
    const token = request.headers.authorization;
    
    if (!token) {
        console.log('Not a token');
        return response.status(401).json({ message: 'missing auth token' });
    }
    
    return jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
          console.log('Token err', err.message);
          return response.status(401).json({ message: 'jwt malformed' });
      }
      
      request.userLogged = decoded.userLogged;
      next();
    });
}

module.exports = {
    isValid,
    secretKey,
};