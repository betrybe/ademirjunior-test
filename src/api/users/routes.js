const express = require('express');
const jwt = require('../auth/jwt');
const controllers = require('./controllers');

const router = express.Router();

router.use(express.json());
router.post('/users', controllers.store);
router.post('/users/admin', jwt.isValid, controllers.storeAdmin);

module.exports = router;