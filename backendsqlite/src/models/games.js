const Sequelize = require('sequelize');
const db = require('./database.js');
const users = require('./users.js')

const games = db.define(
  'games',
  {
    idGame: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true
    },
    minPlayers: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 5
    },
    maxPlayers: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 20
    },
    dayDuration: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    nightDuration: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    werewolfProbability: {
      type: Sequelize.DECIMAL,
      allowNull: true,
      defaultValue: 0.33
    },
    started: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  { timestamps: false }
);

users.hasOne(games, { foreignKey: 'creatorUsername' });
module.exports = games;
