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
const Votes = require('../models/votes.js');
const { checkRightRole } = require('../middlewares/gameValidators.js');

function getRandomNumbers (k, n) {
  // we use this to determine who is a werewolf and who is human
  if (k > n) {
    console.error('Error: k cannot be greater than n.');
    return [];
  }
  const indexWerewolves = [];
  const indexHumans = [];
  // Initialize availableNumbers array with all numbers in the range
  for (let i = 0; i < n; i++) {
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
  const {
    minPlayers, maxPlayers, dayDuration, nightDuration,
    werewolfProbability, startingDate
  } = JSON.parse(req.body.data);
  const newGame = await Games.create({
    creatorUsername,
    startingDate,
    minPlayers,
    maxPlayers,
    dayDuration,
    nightDuration,
    werewolfProbability
  });
  // add creator as player also
  await Players.create({ username: creatorUsername, idGame: newGame.idGame });
  res.status(status.CREATED).json({ message: 'game created',data : newGame.idGame});
};

const getGames = async (req, res) => {
  const games = await Games.findAll();
  const gamesWithPlayers = await Promise.all(games.map(async (game) => {
    let players = await Players.findAll({ attributes: ['username'], where: { idGame: game.idGame } });
    let avatarId = await Users.findOne({ attributes: ['avatarId'], where: { username: game.creatorUsername } });
    players = players.map(player => player.username);
    avatarId = avatarId.avatarId;
    return { ...game.toJSON(), players, avatarId };
  }));
  res.status(status.OK).json({ message: 'returning games in the data property', data: JSON.stringify(gamesWithPlayers) });
};

const joinGame = async (req, res) => {
  const username = req.username;
  const idGame = req.params.idGame;
  // check room capacity
  const players = await Players.findAll({ where: { idGame } });
  const currentPlayers = players.length;
  const game = await Games.findOne({ where: { idGame } });
  if (currentPlayers >= game.maxPlayers) {
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

const gameStates = {};

function changeDayTime (idGame) {
  const { game } = gameStates[idGame];
  gameStates[idGame].timeoutStart = new Date();
  // archiving all the messages
  Messages.findAll({
    include: [{
      model: PlayersInGame,
      include: [{ model: Players, where: { idGame } }]
    }]
  }).then((messages) => {
    messages.forEach((msg) => { msg.current = false; msg.save(); });
  });

  voteIsValidated(idGame).then(async (idPlayer) => {
  // we check for lynched users
    if (idPlayer !== undefined) {
      await PlayersInGame.update({
        state: 'dead'
      }, { where: { idPlayer } });
      // we remove the votes now that we dont need them
      const playersInGame = await PlayersInGame.findAll({
        include: [{ model: Players, where: { idGame } }] }); //, where: { idGame } });
      playersInGame.forEach((player) => {
        Votes.destroy({ where: { voterIdPlayer: player.idPlayer } });
      });
    }
  });
  if (game.gameTime === 'day') {
    const time = game.nightDuration * 60 * 1000;
    game.gameTime = 'night';
    gameStates[idGame].timeoutTime = time;
    setTimeout(changeDayTime, time, idGame);
  } else {
    console.assert(game.gameTime === 'night');
    const time = game.dayDuration * 60 * 1000;
    gameStates[idGame].timeoutTime = time;
    game.gameTime = 'day';
    setTimeout(changeDayTime, time, idGame);
  }
  game.save();
}

const startGame = async (req, res) => {
  const idGame = req.params.idGame;
  const username = req.username;
  console.assert(username !== undefined);
  console.assert(idGame !== undefined);
  const game = await Games.findOne({ where: { idGame } });
  // change started to true
  // create playersInGame
  const players = await Players.findAll({ attributes: ['idPlayer'], where: { idGame } });
  // une proportion n'est pas une proba (cf cahier des charges)
  // => il faut choisir nbJoueurs * proportionLG parmi nbJoueurs
  let nbWerewolves = Math.round(players.length * game.werewolfProbability);
  if (nbWerewolves === 0) nbWerewolves = 1;
  const { indexWerewolves, indexHumans } = getRandomNumbers(nbWerewolves, players.length);
  // assign wws
  for (const i of indexWerewolves) {
    const idPlayer = players[i].idPlayer;
    await PlayersInGame.create({ role: 'werewolf', idPlayer }); // default value for state is alive
  }
  // create associations for humans
  // const playersingame = await PlayersInGame.findAll();
  for (const i of indexHumans) {
    const idPlayer = players[i].idPlayer;
    await PlayersInGame.create({ role: 'human', idPlayer }); // default value for state is alive
  }

  game.started = true;
  const currentDate = new Date();
  game.startingDate = currentDate;
  game.gameTime = 'day';
  const time = game.dayDuration * 60 * 1000;
  gameStates[idGame] = { game, timeoutStart: currentDate, timeoutTime: time };
  setTimeout(changeDayTime, time, idGame);
  game.save();

  // assign role contaminant
  // const indexCont = -1;
  // console.log('adding contaminant');
  // if (Math.random() < game.infectionProbability || true) {
  //  // pick one among ww
  //  indexCont = Math.floor(Math.random() * indexWerewolves.length);
  //  const idPlayer = players[indexCont].idPlayer;
  //  const power = await Powers.findOne({ where: { name: 'contaminant' } });
  //  console.log('power to be added : ', power);
  //  PlayersPowers.create({ power, idPlayer });
  // }
  // let indexIns = -1;
  /// / assign role insomnie
  // if (Math.random() < game.insomniaProbability) {
  //  // pick one among humans
  //  indexIns = Math.floor(Math.random() * indexHumans.length);
  //  const idPlayer = players[indexIns].idPlayer;
  //  const power = Powers.findOne({ where: { name: 'insomniaque' } });
  //  PlayersPowers.create({ power, idPlayer });
  // }

  /// / on enlève l'insomniaque et le contaminant de l'array players
  /// / ça casse la correspondance entre indexWerewolves, indexHumans
  /// / et les roles réellement distribués,
  /// / c'est pour ça qu'on ne le fait pas avant
  // if (indexCont !== -1) players.splice(indexCont, 1);
  // if (indexIns !== -1) players.splice(indexIns, 1);

  /// / distribue le roles de voyant
  // if (Math.random() < game.seerProbability && players.length > 0) {
  //  const index = Math.floor(Math.random() * players.length);
  //  const player = players[index];
  //  const idPlayer = player.idPlayer;
  //  players.splice(index, 1); // ensures a same player has one power only
  //  const power = await Powers.findOne({ where: { name: 'voyant' } });
  //  PlayersPowers.create({ power, idPlayer });
  // }
  /// / spiritiste
  // if (Math.random() < game.spiritismProbability && players.length > 0) {
  //  // pick one from remaining players
  //  const index = Math.floor(Math.random() * players.length);
  //  const player = players[index];
  //  const idPlayer = player.idPlayer;
  //  const power = Powers.findOne({ where: { name: 'spiritiste' } });
  //  PlayersPowers.create({ power, idPlayer });
  // }
  res.status(status.CREATED).json({ message: 'game started' });
};

function getGameHour (idGame) {
  const { game, timeoutStart, timeoutTime } = gameStates[idGame]; // timeoutTime in ms
  const currentDate = new Date();
  console.assert(timeoutStart >= currentDate);
  const gamePercent = (currentDate - timeoutStart) / timeoutTime; // percent of game time elapsed
  console.assert(gamePercent >= 0 && gamePercent <= 1);
  const start = 8 * 3600 * 1000; // in ms
  const end = 22 * 3600 * 1000; // in ms
  let currentGameHour;
  if (game.gameTime === 'day') {
    currentGameHour = start + gamePercent * (end - start); // in ms
  } else {
    console.assert(game.gameTime === 'night');
    currentGameHour = end + gamePercent * (end - start); // in ms
  }
  // passing ms to string "hh:mm"
  let hours = Math.floor(currentGameHour / (1000 * 3600)) % 24;
  let minutes = (currentGameHour % (1000 * 3600)) / 60;
  if (hours < 10) { hours = `0${hours}`; }
  if (minutes < 10) { minutes = `0${minutes}`; }
  return `${hours}:${minutes}`;
}

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
  // checking gameTime and role
  // if role is human and gameTime is night returning no messages
  let messages = [];
  if (await checkRightRole(req.username, idGame)) {
    messages = await Messages.findAll({
      include: [{
        model: PlayersInGame,
        include: [{ model: Players, where: { idGame } }]
      }],
      where: { current: true }
    });
    // clearing messages output
    messages = messages.map((msg) => {
      msg = msg.toJSON();
      const username = msg.playersInGame.player.username;
      msg.username = username;
      delete msg.playersInGame;
      return msg;
    });
  }
  // get current opened votes
  const openVotes = await getOpenVotes(idGame);
  const state = { players: playersInGame, messages, gameHour: getGameHour(idGame), votes: openVotes };
  res.status(status.OK).json({ message: 'returning game state', data: JSON.stringify(state) });
};

const addMessage = async (req, res) => {
  const data = JSON.parse(req.body.data);
  if (!has(data, 'message')) {
    throw new CodeError('You need to pass a message in the body data', status.BAD_REQUEST);
  }
  const body = data.message;
  const idPlayer = req.idPlayer;

  const time = new Date(); // time gets now timestamp
  const gameTime = 'day';
  Messages.create({ idPlayer, time, body, gameTime });
  res.status(status.CREATED).json({ message: 'message sent' });
};

async function hasAlreadyVoted (username) {
  const player = await Players.findOne({ where: { username } });
  const votes = await Votes.findOne({
    where: { voterIdPlayer: player.idPlayer }
  });
  return votes;
}

async function getOpenVotes (idGame) {
  const playersInGame = await PlayersInGame.findAll({
    include: [{ model: Players, where: { idGame } }]
  });
  const openVotes = {};
  for (const player of playersInGame) {
    const votes = await Votes.findAll({
      attributes: ['voterIdPlayer'],
      where: { accusedIdPlayer: player.idPlayer }
    });
    if (votes.length > 0) {
      openVotes[player.player.username] = votes.length;
    }
  }
  return openVotes;
}
async function voteIsValidated (idGame) {
  const openVotes = await getOpenVotes(idGame);
  const players = await PlayersInGame.findAll({
    include: [{ model: Players, where: { idGame } }]
  });
  let idPlayer;
  const half = players.length / 2;
  players.forEach((player) => {
    if (openVotes[player.player.username] > half) idPlayer = player.player.idPlayer;
  });
  return idPlayer;
}

const votePlayer = async (req, res) => {
  const data = JSON.parse(req.body.data);
  if (!has(data, 'accusedId')) {
    return res.status(status.BAD_REQUEST).json({ message: 'You need to specify the accusedId' });
  }
  const username = req.username;
  const idPlayer = req.idPlayer;
  const idGame = req.params.idGame;
  console.assert(idPlayer !== undefined);
  const hav = await hasAlreadyVoted(username);
  const viv = await voteIsValidated(idGame);
  if (hav && !viv) {
    // player has already voted and vote is not validated so he can change his vote
    // we supress old vote from the table
    await Votes.destroy({ where: { voterIdPlayer: idPlayer } });
  } else if (hav && viv) {
    // player has already voted and vote is not validated
    // so he can't change his vote
    return res.status(status.BAD_REQUEST).json({ message: 'You can\'t change your vote' });
  }
  const { accusedId } = data;
  await Votes.create({ accusedIdPlayer: accusedId, voterIdPlayer: idPlayer });
  return res.status(status.CREATED).json({ message: 'Your vote has been recorded' });
};

module.exports = {
  createGame,
  getGames,
  getGameWithId,
  joinGame,
  startGame,
  getStateOfGame,
  addMessage,
  votePlayer
};
