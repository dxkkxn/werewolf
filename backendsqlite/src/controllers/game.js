const games = require('../models/games.js');
const status = require('http-status');
const CodeError = require('../util/CodeError.js');

const createGame = async (req, res) => {
  throw new CodeError('not implemented yet', status.NOT_IMPLEMENTED);
};
const getGames = async (req, res) => {
  throw new CodeError('not implemented yet', status.NOT_IMPLEMENTED);
};

module.exports = {
  createGame,
  getGames
};
