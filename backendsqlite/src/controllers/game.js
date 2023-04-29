const Games = require('../models/games.js');
const status = require('http-status');
// const has = require('has-keys');
const CodeError = require('../util/CodeError.js');
const Players = require('../models/players.js');
const PlayersInGame = require('../models/playersInGame.js');

const createGame = async (req, res) => {
  const creatorUsername = req.username;
  const { minPlayers, maxPlayers, dayDuration, nightDuration, werewolfProbability } = JSON.parse(req.body.data);
  const newGame = await Games.create({ creatorUsername, minPlayers, maxPlayers, dayDuration, nightDuration, werewolfProbability });
  // add creator as player also
  await Players.create({ username: creatorUsername, idGame: newGame.idGame });
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

const getGameWithId = async (req, res) => {
  const { idGame } = req.params;
  const game = await Games.findOne({ where: { idGame } });
  let players = await Players.findAll({ attributes: ['username'], where: { idGame } });
  players = players.map(player => player.username);
  const gameWithPlayers = { ...game.toJSON(), players };
  res.status(status.OK).json({ message: 'returning game in the data property', data: JSON.stringify(gameWithPlayers) });
};

const startGame = async (req, res) => {
  const idGame = req.params.idGame;
  const username = req.username;
  console.assert(username !== undefined);
  console.assert(idGame !== undefined);
  // change started to true
  const game = await Games.findOne({ where: { idGame } });
  game.started = true;
  game.save(); // REVIEW: maybe await?
  // create playersInGame
  const players = await Players.findAll({ attributes: ['idPlayer'], where: { idGame } });
  for (const player of players) {
    // player will be a werewolf?
    let role = 'human';
    if (Math.random() < game.werewolfProbability) role = 'werewolf';
    const idPlayer = player.idPlayer;
    PlayersInGame.create({ role, idPlayer });
  }
  res.status(status.CREATED).json({ message: 'game started' });
};
const getStateOfGame = async (req, res) => {
  const idGame = req.params.idGame;
  console.assert(idGame !== undefined);
  const playersInGame = await PlayersInGame.findAll({ include: [{model: Players, where: {idGame} }]}); //, where: { idGame } });
  res.status(status.OK).json({ message: 'returning players states', data: JSON.stringify(playersInGame) });
};
module.exports = {
  createGame,
  getGames,
  getGameWithId,
  joinGame,
  startGame,
  getStateOfGame,
  addMessage
};
