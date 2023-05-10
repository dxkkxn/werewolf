const Games = require('../models/games.js');
const Users = require('../models/users.js');
const status = require('http-status');
const has = require('has-keys');
const CodeError = require('../util/CodeError.js');
const Players = require('../models/players.js');
const PlayersInGame = require('../models/playersInGame.js');
const Powers = require('../models/powers.js');
const PlayersPowers = require('../models/playersPowers.js');
const Messages = require('../models/messages.js');

function getRandomNumbers(k, n) {
  // we use this to determine who is a werewolf and who is human
  if (k > n) {
    console.error('Error: k cannot be greater than n.');
    return [];
  }
  const indexWerewolves = [];
  const indexHumans = [];
  // Initialize availableNumbers array with all numbers in the range
  for (let i = 1; i <= n; i++) {
    indexHumans.push(i);
  }
  // Pick k distinct random numbers
  for (let j = 0; j < k; j++) {
    const randomIndex = Math.floor(Math.random() * indexHumans.length);
    const num = indexHumans[randomIndex];
    // Remove the selected number from availableNumbers
    indexHumans.splice(randomIndex, 1);
    // Add the selected number to the final numbers array
    indexWerewolves.push(num);
  }
  return { indexWerewolves, indexHumans };
}

const createGame = async (req, res) => {
  const creatorUsername = req.username;
  const userAlreadyInGame = await Players.findOne({ where: { username: creatorUsername } });
  if (userAlreadyInGame) {
    throw new CodeError(`user: ${creatorUsername} already in game `, status.FORBIDDEN);
  }
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
    let avatarId = await Users.findOne({ attributes: ['avatarId'], where: { username: game.creatorUsername } });
    console.log('id : ', avatarId);
    players = players.map(player => player.username);
    avatarId = avatarId.avatarId;
    return { ...game.toJSON(), players, avatarId };
  }));
  res.status(status.OK).json({ message: 'returning games in the data property', data: JSON.stringify(gamesWithPlayers) });
};

const joinGame = async (req, res) => {
  const username = req.username;
  const idGame = req.params.idGame;
  // check if user already in game
  const userAlreadyInGame = await Players.findOne({ where: { username } });
  if (userAlreadyInGame) {
    throw new CodeError(`user: ${username} already in game`, status.FORBIDDEN);
  }
  // check rooms are available
  const players = await Players.findAll({ where: { idGame } });
  const maxPlayers = await Games.findOne({ attributes: ['maxPlayers'], where: { idGame } });
  if (players.length > maxPlayers) {
    throw new CodeError('maximum number of players reached', status.FORBIDDEN);
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
  // une proportion n'est pas une proba (cf cahier des charges)
  // => il faut choisir nbJoueurs * proportionLG parmi nbJoueurs
  let nbWerewolves = Math.round(players.length * game.werewolfProbability);
  if (nbWerewolves === 0) nbWerewolves = 1;
  const { indexWerewolves, indexHumans } = getRandomNumbers(nbWerewolves, players.length);
  // assign wws
  for (const i in indexWerewolves) {
    const idPlayer = players[i].idPlayer;
    PlayersInGame.create({ role: 'loup-garou', idPlayer }); // default value for state is alive
  }
  // create associations for humans

  for (const i in indexHumans) {
    const idPlayer = players[i].idPlayer;
    PlayersInGame.create({ role: 'humain', idPlayer }); // default value for state is alive
  }
  let indexCont = -1;
  // assign role contaminant
  if (Math.random() < game.infectionProbability) {
    // pick one among ww
    indexCont = Math.floor(Math.random() * indexWerewolves.length);
    const power = Powers.create({ name: 'contaminant' });
    const idPlayer = players[indexCont].idPlayer;
    PlayersPowers.create({ power, idPlayer });
  }
  let indexIns = -1;
  // assign role insomnie
  if (Math.random() < game.insomniaProbability) {
    // pick one among humans
    indexIns = Math.floor(Math.random() * indexHumans.length);
    const power = Powers.create({ name: 'insomniaque' });
    const idPlayer = players[indexIns].idPlayer;
    PlayersPowers.create({ power, idPlayer });
  }

  // on enlève l'insomniaque et le contaminant de l'array players
  // ça casse la correspondance entre indexWerewolves, indexHumans
  // et les roles réellement distribués,
  // c'est pour ça qu'on ne le fait pas avant
  if (indexCont !== -1) players.remove(indexCont);
  if (indexIns !== -1) players.remove(indexIns);

  // distribue le roles de voyant
  if (Math.random() < game.seerProbability && players.length > 0) {
    const index = Math.floor(Math.random() * players.length);
    const player = players[index];
    const power = Powers.create({ name: 'voyant' });
    const idPlayer = player.idPlayer;
    PlayersPowers.create({ power, idPlayer });
    players.remove(index); // ensures a same player has one power only
  }
  // spiritiste
  if (Math.random() < game.spiritismProbability && players.length > 0) {
    // pick one from remaining players
    const index = Math.floor(Math.random() * players.length);
    const player = players[index];
    const power = Powers.create({ name: 'spiritiste' });
    const idPlayer = player.idPlayer;
    PlayersPowers.create({ power, idPlayer });
    players.remove(index); // ensures a same human has one power only
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
