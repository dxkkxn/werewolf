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
    startingDate: {
      type: Sequelize.DATE,
      allowNull: false
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
      defaultValue: 3,
      allowNull: false
    },
    nightDuration: {
      type: Sequelize.INTEGER,
      defaultValue: 2,
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
    },
    gameTime: {
      type: Sequelize.STRING,
      validate: {
        isIn: {
          args: [['day', 'night']],
          msg: 'gameTime can only be day or night'
        }
      }
    }
  },
  { timestamps: false }
);

users.hasOne(games, { foreignKey: 'creatorUsername' });
module.exports = games;
