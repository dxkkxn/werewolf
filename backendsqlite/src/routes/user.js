const express = require('express');
const router = express.Router();
const { checkUser, addUser ,getUsers , updateUser, getUser } = require('../controllers/user.js');
const { validateAddUser, validateBody ,validateToken} = require('../middlewares/userValidators.js');

router.get('/users',getUsers)

router.get('/users/:username',getUser)
router.put('/users/:username',validateToken,updateUser)

router.post('/signin', validateBody, validateAddUser, addUser);
router.post('/login', validateBody, checkUser);

module.exports = router;
