const Games = require('../models/games.js');
const status = require('http-status');
const has = require('has-keys');
const CodeError = require('../util/CodeError.js');
const Players = require('../models/players.js');
const PlayersInGame = require('../models/playersInGame.js');
const Messages = require('../models/messages.js');

const createGame = async (req, res) => {
  const creatorUsername = req.username;
  console.log('username', creatorUsername);
  const { minPlayers, maxPlayers, dayDuration, nightDuration, werewolfProbability, startHour, startDay, insomniaProbability, seerProbability, infectionProbability, spiritismProbability } = JSON.parse(req.body.data);
  const newGame = await Games.create({ creatorUsername, startHour, startDay, infectionProbability, insomniaProbability, seerProbability, spiritismProbability, minPlayers, maxPlayers, dayDuration, nightDuration, werewolfProbability });
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
  let playersInGame = await PlayersInGame.findAll({ include: [{ model: Players, where: { idGame } }] }); //, where: { idGame } });
  // clearing json object to send
  playersInGame = playersInGame.map((player) => {
    player = player.toJSON();
    const username = player.player.username;
    player.username = username;
    delete player.player;
    return player;
  });
  let messages = await Messages.findAll({
    include: [{
      model: PlayersInGame,
      include: [{ model: Players, where: { idGame } }]
    }]
  });
  // clearing messages output
  messages = messages.map((msg) => {
    msg = msg.toJSON();
    const username = msg.playersInGame.player.username;
    msg.username = username;
    delete msg.playersInGame;
    return msg;
  });
  const state = { players: playersInGame, messages };
  res.status(status.OK).json({ message: 'returning game state', data: JSON.stringify(state) });
};

const addMessage = async (req, res) => {
  const data = JSON.parse(req.body.data);
  if (!has(data, 'message')) {
    throw new CodeError('You need to pass a message in the body data', status.BAD_REQUEST);
  }
  const body = data.message;
  const username = req.username;
  let idPlayer = await Players.findAll({ attributes: ['idPlayer'], where: { username } });
  console.assert(idPlayer.length === 1);
  idPlayer = idPlayer[0].idPlayer;

  const time = new Date(); // time gets now timestamp
  const gameTime = 'day';
  Messages.create({ idPlayer, time, body, gameTime });
  res.status(status.CREATED).json({ message: 'message sent' });
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
