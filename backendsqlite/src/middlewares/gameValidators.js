const status = require('http-status');
const Players = require('../models/players.js');
const has = require('has-keys');
const CodeError = require('../util/CodeError.js');
const Games = require('../models/games.js');
const PlayersInGame = require('../models/playersInGame.js');

const validateBodyCreateGame = async (req, res, next) => {
  if (!has(req.body, ['data'])) {
    throw new CodeError('You must include a data property in the request body', status.BAD_REQUEST);
  }
  const data = JSON.parse(req.body.data);
  const requiredAttrs = ['dayDuration', 'nightDuration', 'startingDate'];
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
  if (!has(req.params, 'idGame')) throw new CodeError('no idGame found in params', status.BAD_REQUEST);
  const idGame = req.params.idGame;
  const gameFound = Games.findOne({ where: { idGame } });
  if (!gameFound) throw new CodeError(`Game ${idGame} was not found`, status.BAD_REQUEST);
  next();
};

const validateUserNotAlreadyInGame = async (req, res, next) => {
  const username = req.username;
  const userAlreadyInGame = await Players.findOne({ where: { username } });
  if (userAlreadyInGame) {
    const idGame = userAlreadyInGame.idGame;
    throw new CodeError(`user: ${username} already in game with id: ${idGame}`, status.FORBIDDEN);
  }
  next();
};

const validateGameNotStarted = async (req, res, next) => {
  const idGame = req.params.idGame;
  const username = req.username;
  console.assert(username !== undefined);
  console.assert(idGame !== undefined);
  const started = await Games.findOne({ attributes: ['started'], where: { idGame } });
  if (started.started === true) {
    throw new CodeError(`Game ${idGame} already started`, status.FORBIDDEN);
  }
  next();
};

const validateUserInGame = async (req, res, next) => {
  const idGame = req.params.idGame;
  const username = req.username;
  const inGame = Players.findOne({ where: { username, idGame } });
  if (!inGame) throw new CodeError('player is not in requested game', status.BAD_REQUEST);
  next();
};

const validateUserIsCreator = async (req, res, next) => {
  const idGame = req.params.idGame;
  const username = req.username;
  console.assert(username !== undefined);
  console.assert(idGame !== undefined);
  const creator = await Games.findOne({ attributes: ['creatorUsername'], where: { idGame } });
  if (creator.creatorUsername !== username) {
    throw new CodeError('You can\'t start the game because you are not the creator', status.BAD_REQUEST);
  }
  next();
};

const validateGameStarted = async (req, res, next) => {
  const idGame = req.params.idGame;
  const username = req.username;
  console.assert(username !== undefined);
  console.assert(idGame !== undefined);
  const started = await Games.findOne({ attributes: ['started'], where: { idGame } });
  if (started.started !== true) {
    throw new CodeError('You can\'t get game state because the game didn\'t start', status.BAD_REQUEST);
  }
  next();
};

const validatePlayerAlive = async (req, res, next) => {
  const idGame = req.params.idGame;
  const username = req.username;
  console.assert(username !== undefined);
  console.assert(idGame !== undefined);

  const player = await PlayersInGame.findOne(
    { include: [{ model: Players, where: { username, idGame } }] });

  if (player.state === 'dead') {
    throw new CodeError('Player is dead', status.BAD_REQUEST);
  }
  next();
};


const checkRightRole = async (username, idGame) => {
  console.assert(username !== undefined);
  console.assert(idGame !== undefined);
  let gameTime = await Games.findOne({
    attributes: ['gameTime'],
    where: { idGame }
  });
  gameTime = gameTime.gameTime;
  console.log(gameTime);
  let playerRole = await PlayersInGame.findOne(
    { attributes: ['role'], include: [{ model: Players, where: { username, idGame } }] });
  playerRole = playerRole.role;
  if (gameTime === 'night' && playerRole === 'human') {
    return false;
  }
  return true;
};

const validateRightRole = async (req, res, next) => {
  const idGame = req.params.idGame;
  const username = req.username;
  if (await checkRightRole(username, idGame) === false) {
    const response = {
      message: 'Humans cannot send messages during night',
      status: status.FORBIDDEN
    };
    return res.status(response.status).json(response);
  }
  next();
};

module.exports = {
  validateBodyCreateGame,
  validateIdGame,
  validateUserInGame,
  validateUserIsCreator,
  validateGameNotStarted,
  validateGameStarted,
  validateUserNotAlreadyInGame,
  validatePlayerAlive,
  validateRightRole,
  checkRightRole,

};
