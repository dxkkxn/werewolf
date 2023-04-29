const status = require('http-status');
const has = require('has-keys');
const CodeError = require('../util/CodeError.js');
const games = require('../models/games.js');

const validateBodyCreateGame = async (req, res, next) => {
  if (!has(req.body, ['data'])) {
    throw new CodeError('You must include a data property in the request body', status.BAD_REQUEST);
  }
  const data = JSON.parse(req.body.data);
  // const requiredAttrs = ['minPlayers', 'maxPlayers', 'dayDuration', 'nightDuration', 'werewolfProbability'];
  const requiredAttrs = ['dayDuration', 'nightDuration'];
  const notFoundAttrs = [];
  requiredAttrs.forEach((attr) => {
    if (!has(data, [attr])) {
      notFoundAttrs.push(attr);
    }
  });
  if (notFoundAttrs.length !== 0) {
    throw new CodeError(`needed attributes: [${notFoundAttrs}] where not found`, status.BAD_REQUEST);
  }
  next();
};

const validateIdGame = async (req, res, next) => {
  if (!has(req.params, 'idGame')) throw new CodeError(`no idGame found in params`, status.BAD_REQUEST);
  const idGame = req.params.idGame;
  const gameFound = games.findOne({ where: { idGame } });
  if (!gameFound) throw new CodeError(`Game ${idGame} was not found`, status.BAD_REQUEST);
  next();
};

const validateUserInGame = async (req, res, next) => {
  const idGame = req.params.idGame;
  const gameFound = games.findOne({ where: { idGame } });
  if (!gameFound) throw new CodeError(`Game ${idGame} was not found`, status.BAD_REQUEST);
  next();
};

const validateUserIsCreator = async (req, res, next) => {
  const idGame = req.params.idGame;
  const username = req.username;
  console.assert(username !== undefined);
  console.assert(idGame !== undefined);
  const creator = await games.findOne({ attributes: ['creatorUsername'], where: { idGame } });
  if (creator.creatorUsername !== username) {
    throw new CodeError('You can\'t start the game because you are not the creator', status.BAD_REQUEST);
  }
  next();
};

module.exports = {
  validateBodyCreateGame,
  validateIdGame,
  validateUserInGame,
  validateUserIsCreator
};
