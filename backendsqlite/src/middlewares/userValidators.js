const users = require('../models/users.js');
const status = require('http-status');
const has = require('has-keys');
const CodeError = require('../util/CodeError.js');
const jws = require('jws');
const { SECRET } = process.env;

const validateAddUser = async(req, res, next) => {
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

const validateBody = async(req, res, next) => {
  console.log(req.body);
    if (!has(req.body, ['username'])) {
        throw new CodeError('You must include a username in the request body', status.BAD_REQUEST);
    }
    if (!has(req.body, ['password'])) {
        throw new CodeError('You must include a password in the request body', status.BAD_REQUEST);
    }
    const { username, password } = req.body;
    console.log("username : ", username);
    console.log("mdp : ", password);
    if (!username) {
        throw new CodeError('You must specify a username', status.BAD_REQUEST);
    }
    if (!password) {
        throw new CodeError('You must specify a password', status.BAD_REQUEST);
    }
    Object.assign(req, { username, password });
    next();
};

const validateToken = async(req, res, next) => {
    const token = req.get('x-access-token');
    if (!token) {
        throw new CodeError('You must pass a token in a x-access-token header', status.BAD_REQUEST);
    }
    if (!jws.verify(token, 'HS256', SECRET)) {
        throw new CodeError('Invalid token', status.FORBIDDEN);
    }
    next();
};
module.exports = {
    validateAddUser,
    validateBody,
    validateToken
};
