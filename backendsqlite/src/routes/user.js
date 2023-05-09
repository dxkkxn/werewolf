const express = require('express');
const router = express.Router();
const { checkUser, addUser } = require('../controllers/user.js');
const { validateAddUser, validateBodyLogin, validateBodySignin } = require('../middlewares/userValidators.js');

router.post('/signin', validateBodySignin, validateAddUser, addUser);
router.post('/login', validateBodyLogin, checkUser);

module.exports = router;
