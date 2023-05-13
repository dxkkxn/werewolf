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
  {
    timestamps: false
    // indexes: [
    //   {
    //     unique: true,
    //     fields: ['accusedIdPlayer', 'voterIdPlayer'],
    //   }
    // ]
  }
);

votes.belongsTo(playersInGame, {
  foreignKey: 'accusedIdPlayer',
  primaryKey: true,
  unique: true
});

votes.belongsTo(playersInGame, {
  foreignKey: 'voterIdPlayer',
  unique: true
});

module.exports = votes;
