const db = require('./database.js');
const playersInGame = require('./playersInGame.js');
const players = require('./players.js');
const Sequelize = require('sequelize');

const votes = db.define(
  'votes',
  {
    accusedIdPlayer: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    voterIdPlayer: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true
    }
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['accusedIdPlayer', 'voterIdPlayer']
      }
    ]
  }
);

votes.belongsTo(playersInGame, {
  foreignKey: 'accusedIdPlayer'
});

votes.belongsTo(playersInGame, {
  foreignKey: 'voterIdPlayer',
  primaryKey: true,
  unique: true
});

module.exports = votes;
