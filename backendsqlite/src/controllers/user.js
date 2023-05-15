const users = require('../models/users.js');
const status = require('http-status');
const CodeError = require('../util/CodeError.js');
const bcrypt = require('bcrypt');
const { SECRET } = process.env;
const jws = require('jws');
// const validator = require('validator');

const getUsers = async (req, res) => {
  try {
    const data = await users.findAll({
      attributes: ['username', 'password', 'avatarId']
    });
    res.json({ status: true, message: 'Users returned !', data });
  } catch (error) {
    res.send({ status: false, message: error.message });
  }
};
const getUser = async (req, res) => {
  const username = req.params.username;
  try {
    const data = await users.findOne({
      where: { username },
      attributes: ['username', 'password', 'avatarId']
    });
    res.status(status.OK).json({ message: 'User returned !', data });
  } catch (error) {
    res.send({ status: false, message: error.message });
  }
};
const updateUser = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'No data provided in request body.' });
  }
  const username = req.params.username;
  const data = JSON.parse(req.body.data);
  const { username: usernameUpdated, password: passwordUpdated, avatarId: avatarIdUpdated } = data;

  try {
    const user = await users.findOne(
      {
        where: { username },
        attributes: ['username']
      });
    if (!user) {
      throw new CodeError('not existing user', status.UNAUTHORIZED);
    }
    await users.update({ username: usernameUpdated, password: passwordUpdated, avatarId: avatarIdUpdated }, { where: { username } });
    res.json({ status: true, message: 'User updated !' });
  } catch (error) {
    res.send({ status: false, message: error.message });
  }
};

const addUser = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'No data provided in request body.' });
  }
  const data = JSON.parse(req.body.data);
  const { username, password, avatarId } = data;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await users.create({ username, password: hashedPassword, avatarId });
    const token = jws.sign({
      header: { alg: 'HS256' },
      payload: username,
      secret: SECRET
    });
    res.status(status.CREATED).json({ message: 'user added', token });
  } catch (error) {
    res.status(500).json({ message: 'internal error' });
  }
};

const checkUser = async (req, res) => {
  const data = JSON.parse(req.body.data);
  const { username, password } = data;
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
  getUsers,
  updateUser,
  getUser,
  checkUser
};
