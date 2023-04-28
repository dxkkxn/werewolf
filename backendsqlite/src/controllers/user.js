const users = require('../models/users.js');
const status = require('http-status');
// const has = require('has-keys');
const CodeError = require('../util/CodeError.js');
const bcrypt = require('bcrypt');
// const jws = require('jws');
// const validator = require('validator');

// const getUsers = async (req, res) => {
//   try {
//     const data = await users.findAll({
//       attributes: ['id', 'username', 'password'],
//     });
//     res.json({ status: true, message: 'returning users', data });
//   } catch (error) {
//     res.send({ status: false, message: error.message });
//   }
// };

const addUser = async (req, res) => {
  try {
    const { username, password } = req;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await users.create({ username, password: hashedPassword });
    res.status(status.CREATED).json({ message: 'user added' });
  } catch (error) {
    res.status(status.INTERNAL_ERROR).json({ message: 'internal error' });
  }
};

const checkUser = async (req, res) => {
  const { username, password } = req;
  const user = await users.findOne(
    {
      where: { username },
      attributes: ['username', 'password']
    });
  const [usernameDB, passwordDB] = [user.username, user.password];
  if (!usernameDB) {
    throw new CodeError('not existing user', status.UNAUTHORIZED);
  }
  const result = await bcrypt.compare(password, passwordDB);
  if (!result) {
    throw new CodeError('passwords dont match', status.UNAUTHORIZED);
  }
  res.status(status.OK).json({ message: 'logged succesfully', token: 'abcd' });
};

module.exports = {
  addUser,
  checkUser
};
