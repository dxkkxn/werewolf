const db = require('./database.js');
const playersInGame = require('./playersInGame.js');
const votingMessages = require('../models/votingMessages.js');

const voters = db.define(
  'voters',
  {},
  { timestamps: false }
);
playersInGame.belongsToMany(votingMessages, { foreignKey: 'idPlayer', primaryKey: true, through: 'voters' });
votingMessages.belongsToMany(playersInGame, { foreignKey: 'idMessage', primaryKey: true, through: 'voters' });

module.exports = voters;
