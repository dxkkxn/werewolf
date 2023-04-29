const games = require('../models/games.js');
const status = require('http-status');
const has = require('has-keys');
const CodeError = require('../util/CodeError.js');
const players = require('../models/players.js');

const createGame = async (req, res) => {
  const creatorUsername = req.username;
  const { minPlayers, maxPlayers, dayDuration, nightDuration, werewolfProbability } = JSON.parse(req.body.data);
  await games.create({ creatorUsername, minPlayers, maxPlayers, dayDuration, nightDuration, werewolfProbability });
  res.status(status.CREATED).json({ message: 'game created' });
};

const getGames = async (req, res) => {
  const x = await games.findAll();
  res.status(status.OK).json({ message: 'returning games in the data property', data: JSON.stringify(x) });
};

const getStateGame = async (req, res) => {
  throw new CodeError('not implemented yet', status.NOT_IMPLEMENTED);
};

const joinGame = async (req, res) => {
  const username = req.username;
  const idGame = req.params.idGame;
  await players.create({ username, idGame });
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
