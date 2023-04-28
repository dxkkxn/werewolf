const express = require('express');
const router = express.Router();
const { checkUser, addUser } = require('../controllers/user.js');
const { validateAddUser, verifBody } = require('../middlewares/validateUser.js');

router.post('/signin', verifBody, validateAddUser, addUser);
router.post('/login', verifBody, checkUser);

module.exports = router;
