const Games = require('../models/games.js');
const Users = require('../models/users.js');
const status = require('http-status');
const has = require('has-keys');
const CodeError = require('../util/CodeError.js');
const Players = require('../models/players.js');
const PlayersInGame = require('../models/playersInGame.js');
const Powers = require('../models/powers.js');
const PowersProbabilities = require('../models/powersProbabilities.js');
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
    werewolfProbability, startingDate, seerProbability,
    insomniaProbability, infectionProbability, spiritismProbability
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
  // create power probabilities
  const toBeWaited = [];
  if (seerProbability && seerProbability > 0) {
    const getPower = await Powers.findOne({ where: { name: 'voyant' } });
    toBeWaited.push(await PowersProbabilities.create({ idGame: newGame.idGame, probability: seerProbability, name: getPower.name }));
  }
  if (spiritismProbability && spiritismProbability > 0) {
    const getPower = await Powers.findOne({ where: { name: 'spiritiste' } });
    toBeWaited.push(await PowersProbabilities.create({ idGame: newGame.idGame, probability: spiritismProbability, name: getPower.name }));
  }
  if (infectionProbability && infectionProbability > 0) {
    const getPower = await Powers.findOne({ where: { name: 'contaminant' } });
    toBeWaited.push(await PowersProbabilities.create({ idGame: newGame.idGame, probability: infectionProbability, name: getPower.name }));
  }
  if (insomniaProbability && insomniaProbability > 0) {
    const getPower = await Powers.findOne({ where: { name: 'insomniaque' } });
    toBeWaited.push(await PowersProbabilities.create({ idGame: newGame.idGame, probability: insomniaProbability, name: getPower.name }));
  }
  // Wait for the creation of PowersProbabilities records to finish before proceeding
  if (toBeWaited.length > 0) await Promise.all(toBeWaited);
  const currentDate = new Date();
  const start = new Date(startingDate);
  // const time = new Date(startingDate) - new Date();
  const time = start.getTime() - currentDate.getTime();
  req.params.idGame = newGame.idGame;
  req.auto = true;
  timeouts[newGame.idGame] = setTimeout(startGame, time, req, res);
  res.status(status.CREATED).json({ message: 'game created', data: newGame.idGame });
};

const getGames = async (req, res) => {
  const games = await Games.findAll();
  const gamesWithPlayers = await Promise.all(games.map(async (game) => {
    let players = await Players.findAll({ attributes: ['username'], where: { idGame: game.idGame } });
    let avatarId = await Users.findOne({ attributes: ['avatarId'], where: { username: game.creatorUsername } });
    const seerProbaPromise = PowersProbabilities.findOne({ attributes: ['probability'], where: { idGame: game.idGame, name: 'voyant' } });
    const infectionProbaPromise = PowersProbabilities.findOne({ attributes: ['probability'], where: { idGame: game.idGame, name: 'contaminant' } });
    const spiritismProbaPromise = PowersProbabilities.findOne({ attributes: ['probability'], where: { idGame: game.idGame, name: 'spiritiste' } });
    const insomniaProbaPromise = PowersProbabilities.findOne({ attributes: ['probability'], where: { idGame: game.idGame, name: 'insomniaque' } });

    // Wait for all promises to resolve
    const [seerPromise, infectionPromise, spiritismPromise, insomniaPromise] = await Promise.all([
      seerProbaPromise,
      infectionProbaPromise,
      spiritismProbaPromise,
      insomniaProbaPromise
    ]);
    let insomniaProba = 0;
    let infectionProba = 0;
    let spiritismProba = 0;
    let seerProba = 0;
    if (seerPromise) seerProba = seerPromise.probability;
    if (infectionPromise) infectionProba = infectionPromise.probability;
    if (spiritismPromise) spiritismProba = spiritismPromise.probability;
    if (insomniaPromise) insomniaProba = insomniaPromise.probability;
    players = players.map(player => player.username);
    avatarId = avatarId.avatarId;
    return { ...game.toJSON(), players, avatarId, seerProba, infectionProba, spiritismProba, insomniaProba };
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
  if (currentPlayers + 1 === game.maxPlayers) {
    req.auto = true;
    await startGame(req, res);
  }
  return res.status(status.OK).json({ message: `user: ${username} joined game with id: ${idGame}` });
};

const getGameWithId = async (req, res) => {
  const { idGame } = req.params;
  const game = await Games.findOne({ where: { idGame } });
  const seerProbaPromise = PowersProbabilities.findOne({ attributes: ['probability'], where: { idGame: game.idGame, name: 'voyant' } });
  const infectionProbaPromise = PowersProbabilities.findOne({ attributes: ['probability'], where: { idGame: game.idGame, name: 'contaminant' } });
  const spiritismProbaPromise = PowersProbabilities.findOne({ attributes: ['probability'], where: { idGame: game.idGame, name: 'spiritiste' } });
  const insomniaProbaPromise = PowersProbabilities.findOne({ attributes: ['probability'], where: { idGame: game.idGame, name: 'insomniaque' } });

  // Wait for all promises to resolve
  const [seerPromise, infectionPromise, spiritismPromise, insomniaPromise] = await Promise.all([
    seerProbaPromise,
    infectionProbaPromise,
    spiritismProbaPromise,
    insomniaProbaPromise
  ]);
  let insomniaProba = 0;
  let infectionProba = 0;
  let spiritismProba = 0;
  let seerProba = 0;
  if (seerPromise) seerProba = seerPromise.probability;
  if (infectionPromise) infectionProba = infectionPromise.probability;
  if (spiritismPromise) spiritismProba = spiritismPromise.probability;
  if (insomniaPromise) insomniaProba = insomniaPromise.probability;
  let players = await Players.findAll({ attributes: ['username'], where: { idGame } });
  players = players.map(player => player.username);
  const gameWithPlayers = { ...game.toJSON(), players, seerProba, infectionProba, spiritismProba, insomniaProba };
  res.status(status.OK).json({ message: 'returning game in the data property', data: JSON.stringify(gameWithPlayers) });
};

const gameStates = {};
const timeouts = {};

async function checkGameEnd (idGame) {
  const alivePlayers = await PlayersInGame.findAll(
    { include: [{ model: Players, where: { idGame } }], where: { state: 'alive' } });
  const role = alivePlayers[0].role;
  return alivePlayers.every((player) => player.role === role);
}

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

  voteIsValidated(idGame, game.gameTime).then(async (idPlayer) => {
  // we check for lynched users
    if (idPlayer !== undefined) {
      await PlayersInGame.update({
        state: 'dead'
      }, { where: { idPlayer } });
      // we remove the votes now that we dont need them
      const playersInGame = await PlayersInGame.findAll(
        { include: [{ model: Players, where: { idGame } }] }); //, where: { idGame } });
      playersInGame.forEach((player) => {
        Votes.destroy({ where: { voterIdPlayer: player.idPlayer } });
      });
      if (await checkGameEnd(idGame)) {
        // game ended
        clearTimeout(timeouts[idGame]);
      }
    }
  });
  if (game.gameTime === 'day') {
    const time = game.nightDuration * 60 * 1000;
    game.gameTime = 'night';
    gameStates[idGame].timeoutTime = time;
    timeouts[idGame] = setTimeout(changeDayTime, time, idGame);
  } else {
    console.assert(game.gameTime === 'night');
    const time = game.dayDuration * 60 * 1000;
    gameStates[idGame].timeoutTime = time;
    game.gameTime = 'day';
    timeouts[idGame] = setTimeout(changeDayTime, time, idGame);
  }
  game.save();
}

const startGame = async (req, res) => {
  const idGame = req.params.idGame;
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
  clearTimeout(timeouts[idGame]); // timeout of start of game
  timeouts[idGame] = setTimeout(changeDayTime, time, idGame);
  game.save();

  // assign role contaminant
  const powerC = await PowersProbabilities.findOne({ attributes: ['probability'], where: { idGame, name: 'contaminant' } });
  let indexCont = -1;
  if (powerC) {
    if (Math.random() < powerC.probability) {
    // pick one among ww
      indexCont = Math.floor(Math.random() * indexWerewolves.length);
      // requires playerInGame
      await PlayersPowers.create({ name: 'contaminant', idPlayer: players[indexWerewolves[indexCont]].idPlayer });
    }
  }
  // assign role insomnie
  let indexIns = -1;
  const powerI = await PowersProbabilities.findOne({ attributes: ['probability'], where: { name: 'insomniaque' } });
  if (powerI) {
    if (Math.random() < powerI.probability) {
      // pick one among humans
      indexIns = Math.floor(Math.random() * indexHumans.length);
      const player = players[indexHumans[indexIns]];
      const idPlayer = player.idPlayer;
      await PlayersPowers.create({ name: 'insomniaque', idPlayer });
    }
  }

  // on enlève l'insomniaque et le contaminant de l'array players
  // ça casse la correspondance entre indexWerewolves, indexHumans
  // et les roles réellement distribués,
  // c'est pour ça qu'on ne le fait pas avant
  if (indexCont !== -1) players.splice(indexWerewolves[indexCont], 1);
  if (indexIns !== -1) players.splice(indexHumans[indexIns], 1);

  // distribue le roles de voyant
  const powerV = await PowersProbabilities.findOne({ attributes: ['probability'], where: { name: 'voyant' } });
  if (powerV) {
    if (Math.random() < powerV.probability && players.length > 0) {
      const index = Math.floor(Math.random() * players.length);
      const player = players[index];
      const idPlayer = player.idPlayer;
      players.splice(index, 1); // ensures a same player has one power only
      await PlayersPowers.create({ name: 'voyant', idPlayer });
    }
  }
  // / spiritiste
  // if (Math.random() < game.spiritismProbability && players.length > 0) {
  //  // pick one from remaining players
  //  const index = Math.floor(Math.random() * players.length);
  //  const player = players[index];
  //  const idPlayer = player.idPlayer;
  //  const power = Powers.findOne({ where: { name: 'spiritiste' } });
  //  PlayersPowers.create({ power, idPlayer });
  // }
  if (!req.auto) {
    res.status(status.CREATED).json({ message: 'game started' });
  }
};

function getGameHour (idGame) {
  const { game, timeoutStart, timeoutTime } = gameStates[idGame]; // timeoutTime in ms
  const currentDate = new Date();
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

async function playerIsDead (idPlayer, idGame) {
  const player = await PlayersInGame.findOne(
    { include: [{ model: Players, where: { idGame } }], where: { idPlayer } });
  return player.state === 'dead';
}

function clearMessagesOutput (messages) {
  return messages.map((msg) => {
    console.assert(msg.playersInGame);
    msg = msg.toJSON();
    const username = msg.playersInGame.player.username;
    msg.username = username;
    delete msg.playersInGame;
    return msg;
  });
}

const doesNotSleep = async (idPlayer) => {
  const power = await PlayersPowers.findOne({ where: { idPlayer, name: 'insomniaque' } });
  if (power) return true;
  return false;
};

const getRole = async (req, res) => {
  const data = JSON.parse(req.body.data);
  const targetId = data.targetId;
  const player = await Players.findOne({ where: { idPlayer: targetId } });
  const role = player.role;
  res.status(status.OK).json({ message: 'returning role', data: role });
};

const getStateOfGame = async (req, res) => {
  const idGame = req.params.idGame;
  const idPlayer = req.idPlayer;
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

  if (await checkGameEnd(idGame)) {
    // game ended
    const messages = await Messages.findAll({
      include: [{
        model: PlayersInGame,
        required: true,
        include: [{ model: Players, required: true, where: { idGame } }]
      }]
    });
    // messages = clearMessagesOutput(messages); // prettier format
    const state = { players: playersInGame, messages, gameEnded: true };
    return res.status(status.OK).json({ message: 'returning game state', data: JSON.stringify(state) });
  }
  // checking gameTime and role
  // if role is human and gameTime is night returning no messages
  let messages = [];
  // const crr = await checkRightRole(req.username, idGame);
  // const pid = await playerIsDead(idPlayer, idGame);
  if (await checkRightRole(req.username, idGame) || await playerIsDead(idPlayer, idGame)) {
    messages = await Messages.findAll({
      include: [{
        model: PlayersInGame,
        required: true,
        include: [{ model: Players, required: true, where: { idGame } }]
      }],
      where: { current: true }
    });
    // clearing messages output
    messages = clearMessagesOutput(messages); // prettier format
  }
  // get current opened votes
  const openVotes = await getOpenVotes(idGame);
  const state = {
    players: playersInGame,
    messages,
    gameHour: getGameHour(idGame),
    votes: openVotes,
    gameEnded: false
  };
  res.status(status.OK).json({ message: 'returning game state', data: JSON.stringify(state) });
};

const addMessage = async (req, res) => {
  const data = JSON.parse(req.body.data);
  if (!has(data, 'message')) {
    throw new CodeError('You need to pass a message in the body data', status.BAD_REQUEST);
  }
  const body = data.message;
  const idPlayer = req.idPlayer;
  const idGame = req.params.idGame;

  const time = new Date(); // time gets now timestamp
  const gameTime = await getGameTime(idGame);
  const message = await Messages.create({ idPlayer, time, body, gameTime });
  res.status(status.CREATED).json({ message: 'message sent' });
};

async function hasAlreadyVoted (username) {
  const player = await Players.findOne({ where: { username } });

  // powers

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

async function getGameTime (idGame) {
  const gameTime = await Games.findOne({ where: { idGame }, attributes: ['gameTime'] });
  return gameTime.gameTime;
}

async function voteIsValidated (idGame, gameTime) {
  const openVotes = await getOpenVotes(idGame);

  const alivePlayers = await PlayersInGame.findAll({
    include: [{ model: Players, where: { idGame } }],
    where: { state: 'alive' }
  });

  const aliveWerewolfs = await PlayersInGame.findAll({
    include: [{ model: Players, where: { idGame } }],
    where: { role: 'werewolf', state: 'alive' }
  });

  let half;
  if (gameTime === 'day') half = alivePlayers.length / 2;
  else half = aliveWerewolfs.length / 2;

  let idPlayer;
  alivePlayers.forEach((player) => {
    if (openVotes[player.player.username] > half) idPlayer = player.player.idPlayer;
  });
  return idPlayer;
}

const getMyPower = async (req, res) => {
  const idPlayer = req.idPlayer;
  console.assert(idPlayer !== undefined);
  let power = await PlayersPowers.findOne({ attributes: ['name'], where: { idPlayer } });
  if (power) power = power.name;
  else power = 'none';
  return res.status(status.CREATED).json({ data: power });
};

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
  const viv = await voteIsValidated(idGame, await getGameTime(idGame));
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
  getMyPower,
  getGameWithId,
  joinGame,
  startGame,
  getStateOfGame,
  getRole,
  addMessage,
  votePlayer
};
