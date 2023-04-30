const users = require('../models/users.js');
const status = require('http-status');
const CodeError = require('../util/CodeError.js');
const bcrypt = require('bcrypt');
const { SECRET } = process.env;
const jws = require('jws');
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
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'No data provided in request body.'  });
  }
  const { username, password } = req.body;
  console.log(username, password);
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await users.create({ username, password: hashedPassword });
    res.status(status.CREATED).json({ message: 'user added' });
  } catch (error) {
    res.status(500).json({ message: 'internal error' });
  }
};

const checkUser = async (req, res) => {
  const { username, password } = req.body;
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
  const token = jws.sign({
    header: { alg: 'HS256' },
    payload: username,
    secret: SECRET
  });
  res.status(status.OK).json({ message: 'logged succesfully', token });
};

module.exports = {
  addUser,
  checkUser
};
