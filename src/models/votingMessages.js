const Sequelize = require('sequelize');
const db = require('./database.js');
const playersInGame = require('./playersInGame.js');
const messages = require('./messages.js');

const votingMessages = db.define(
  'votingMessages',
  {
    accuserIdMessage: {
      type: Sequelize.INTEGER,
      primaryKey: true
    }
  },
  { timestamps: false }
);

messages.hasOne(votingMessages, { foreignKey: 'accuserIdMessage', primaryKey: true });
playersInGame.hasOne(votingMessages, { foreignKey: 'accusedIdPlayer' });

module.exports = votingMessages;
