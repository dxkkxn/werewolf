const express = require('express');
const router = express.Router();
const { checkUser, addUser } = require('../controllers/user.js');
const { validateAddUser, validateBody } = require('../middlewares/userValidators.js');

router.post('/signin', validateBody, validateAddUser, addUser);
router.post('/login', validateBody, checkUser);

module.exports = router;
