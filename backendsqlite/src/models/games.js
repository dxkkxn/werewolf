const Sequelize = require('sequelize');
const db = require('./database.js');
const users = require('./users.js');

const games = db.define(
  'games',
  {
    idGame: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true
    },
    creatorUsername: {
      type: Sequelize.STRING,
      alloxNull: false
    },
    startHour: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 8
    },
    startDay: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    infectionProbability: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    insomniaProbability: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    seerProbability: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    spiritismProbability: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
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
