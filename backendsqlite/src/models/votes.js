const db = require('./database.js');
const playersInGame = require('./playersInGame.js');
const players = require('./players.js');
const Sequelize = require('sequelize');

const votes = db.define(
  'votes',
  {
    accusedIdPlayer: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true
    },
    voterIdPlayer: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true
    }
  },
  { timestamps: false }
);

playersInGame.belongsTo(players, {
  foreignKey: 'accusedIdPlayer',
  primaryKey: true,
  unique: true
});

playersInGame.belongsTo(players, {
  foreignKey: 'voterIdPlayer',
  primaryKey: true,
  unique: true
});

module.exports = votes;
