const userModel = require('../models/users.js');
const gameModel = require('../models/games.js');
const powerModel = require('../models/powers.js');
const playerModel = require('../models/players.js');
const powersProbabilityModel = require('../models/powersProbabilities.js');
const playerInGameModel = require('../models/playersInGame.js');
const playersPowers = require('../models/playersPowers.js');
const messages = require('../models/messages.js');
const votingMessages = require('../models/votingMessages.js');
const voters = require('../models/voters.js');

(async () => {
  // Regénère la base de données
  await require('../models/database.js').sync({ force: true });
  console.log('Base de données créée.');
  const powers = ['contaminant', 'insomniaque', 'voyant', 'spiritiste'];
  try {
    powers.forEach(async (power) => await powerModel.create({ name: power }));
  } catch (error) { console.log(error); }
})();
