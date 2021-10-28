const express = require('express');
const path = require('path');
const multer = require('multer');
const jwt = require('../auth/jwt');
const controllers = require('./controllers');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(__dirname, '..', '..', 'uploads'));
    },
    filename: (request, file, callback) => 
        callback(null, `${request.params.id}.${file.mimetype.split('/').pop()}`), 
    
});

const uploadImage = multer({ storage });

router.use(express.json());
router.get('/recipes/:id', controllers.getOne);
router.put('/recipes/:id', jwt.isValid, controllers.update);

router.put('/recipes/:id/image', 
    [jwt.isValid, uploadImage.single('image')], 
    controllers.updateImageField);

router.delete('/recipes/:id', jwt.isValid, controllers.remove);
router.get('/recipes', controllers.getAll);
router.post('/recipes', jwt.isValid, controllers.store);

module.exports = router;