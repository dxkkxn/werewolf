const Games = require('../models/games.js');
const status = require('http-status');
// const has = require('has-keys');
const CodeError = require('../util/CodeError.js');
const Players = require('../models/players.js');

const createGame = async (req, res) => {
  const creatorUsername = req.username;
  const { minPlayers, maxPlayers, dayDuration, nightDuration, werewolfProbability } = JSON.parse(req.body.data);
  await Games.create({ creatorUsername, minPlayers, maxPlayers, dayDuration, nightDuration, werewolfProbability });
  res.status(status.CREATED).json({ message: 'game created' });
};

const getGames = async (req, res) => {
  const games = await Games.findAll();
  const gamesWithPlayers = await Promise.all(games.map(async (game) => {
    let players = await Players.findAll({ attributes: ['username'], where: { idGame: game.idGame } });
    players = players.map(player => player.username);
    return { ...game.toJSON(), players };
  }));
  res.status(status.OK).json({ message: 'returning games in the data property', data: JSON.stringify(gamesWithPlayers) });
};

const getStateGame = async (req, res) => {
  throw new CodeError('not implemented yet', status.NOT_IMPLEMENTED);
};

const joinGame = async (req, res) => {
  const username = req.username;
  const idGame = req.params.idGame;
  // check if user already in game
  const userAlreadyInGame = await Players.findOne({ where: { username, idGame } });
  if (userAlreadyInGame) {
    throw new CodeError(`user: ${username} already in game with id: ${idGame}`, status.FORBIDDEN);
  }
  await Players.create({ username, idGame });
  res.status(status.OK).json({ message: `user: ${username} joined game with id: ${idGame}` });
};

const addMessage = async (req, res) => {
  throw new CodeError('not implemented yet', status.NOT_IMPLEMENTED);
};

module.exports = {
  createGame,
  getGames,
  getStateGame,
  joinGame,
  addMessage
};
