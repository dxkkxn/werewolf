const users = require('../models/users.js');
const status = require('http-status');
const has = require('has-keys');
const CodeError = require('../util/CodeError.js');
const bcrypt = require('bcrypt');

const validateAddUser = async (req, res, next) => {
  const { username } = req;
  const userAlreadyExist = await users.findOne({
    where: {
      username
    }
  });
  if (userAlreadyExist) {
    throw new CodeError(
      'this user already exists',
      status.BAD_REQUEST
    );
  }
  next();
};

const verifBody = async (req, res, next) => {
  if (!has(req.body, ['data'])) {
    throw new CodeError('You must include a request body', status.BAD_REQUEST);
  }
  const { username, password } = JSON.parse(req.body.data);
  if (!username) {
    throw new CodeError('You must specify a username', status.BAD_REQUEST);
  }
  if (!password) {
    throw new CodeError('You must specify a password', status.BAD_REQUEST);
  }
  Object.assign(req, { username, password });
  next();
};

module.exports = {
  validateAddUser,
  verifBody
};
