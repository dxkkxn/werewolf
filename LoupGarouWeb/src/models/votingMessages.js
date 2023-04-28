const Sequelize = require('sequelize');
const db = require('./database.js');
const playersInGame = require('./playersInGame.js');
const messages = require('./messages.js');

const votingMessages = db.define(
  'votingMessages',
  {
    idMessage: {
      type: Sequelize.INTEGER,
      primaryKey: true
    }
  },
  { timestamps: false }
);

messages.hasOne(votingMessages, { foreignKey: 'idMessage', primaryKey: true });
playersInGame.hasOne(votingMessages, { foreignKey: 'accusedIdPlayer' });

module.exports = votingMessages;
