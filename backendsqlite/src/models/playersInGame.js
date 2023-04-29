const Sequelize = require('sequelize');
const db = require('./database.js');
const players = require('./players.js');

const playersInGame = db.define(
  'playersInGame',
  {
    idPlayer: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['werewolf', 'human']],
          msg: 'role can only be werewolf or human'
        }
      },
      defaultValue: 'human'
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['alive', 'dead']],
          msg: 'state can only be alive or dead'
        }
      },
      defaultValue: 'alive'
    }
  },
  { timestamps: false }
);

players.hasOne(playersInGame, {
  foreignKey: 'idPlayer',
  primaryKey: true,
  unique: true
});

module.exports = playersInGame;
