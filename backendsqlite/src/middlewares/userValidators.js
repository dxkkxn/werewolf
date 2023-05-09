const users = require('../models/users.js');
const status = require('http-status');
const has = require('has-keys');
const CodeError = require('../util/CodeError.js');
const jws = require('jws');
const { SECRET } = process.env;

const validateAddUser = async(req, res, next) => {
    const data = JSON.parse(req.body.data);
    const username = data.username;
    const userAlreadyExist = await users.findOne({
        where: {
            username
        }
    });
    if (userAlreadyExist) {
        throw new CodeError(
            'this user already exists',
            status.CONFLICT
        );
    }
    next();
};

const validateBodySignin = async(req, res, next) => {
    if (!has(req.body, ['data'])) {
      throw new CodeError('You must include a data property in the request body', status.BAD_REQUEST);
    }
    const data = JSON.parse(req.body.data);
    if (!has(data, ['username'])) {
        throw new CodeError('You must include a username in the request body', status.BAD_REQUEST);
    }
    if (!has(data, ['password'])) {
        throw new CodeError('You must include a password in the request body', status.BAD_REQUEST);
    }
    if(!has(data, ['avatarId'])) {
      throw new CodeError('You must include an avatarId in the request body', status.BAD_REQUEST);
    }
    const { username, password, avatarId } = data;
    console.log('username : ', username);
    if (!username) {
        throw new CodeError('You must specify a username', status.BAD_REQUEST);
    }
    if (!password) {
        throw new CodeError('You must specify a password', status.BAD_REQUEST);
    }
    if(!avatarId || isNaN(parseInt(avatarId)) || parseInt(avatarId) < 1 || parseInt(avatarId) > 12) {
        throw new CodeError('You must specify a valid avatarId (1 - 12)', status.BAD_REQUEST);
    }
    Object.assign(req, { username, password, avatarId });
    next();
};

const validateBodyLogin = async(req, res, next) => {
    if (!has(req.body, ['data'])) {
      throw new CodeError('You must include a data property in the request body', status.BAD_REQUEST);
    }
    const data = JSON.parse(req.body.data);
    if (!has(data, ['username'])) {
        throw new CodeError('You must include a username in the request body', status.BAD_REQUEST);
    }
    if (!has(data, ['password'])) {
        throw new CodeError('You must include a password in the request body', status.BAD_REQUEST);
    }
    const { username, password } = data;
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
    // getting username from token
    const username = jws.decode(token).payload;
    // check if username exists
    const userFound = users.findOne({ where: { username } });
    if (!userFound) throw new CodeError('Invalid token', status.FORBIDDEN);
    req.username = username;
    next();
};

module.exports = {
    validateAddUser,
    validateBodyLogin,
    validateBodySignin,
    validateToken
};
