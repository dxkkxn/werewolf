const games = require('../models/games.js');
const status = require('http-status');
const has = require('has-keys');
const CodeError = require('../util/CodeError.js');

const createGame = async (req, res) => {
  const creatorUsername = req.params.username;
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
  throw new CodeError('not implemented yet', status.NOT_IMPLEMENTED);
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
