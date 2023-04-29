const Sequelize = require('sequelize');
const db = require('./database.js');
const playersInGame = require('./playersInGame.js');

const messages = db.define(
  'messages',
  {
    idMessage: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true
    },
    time: {
      type: Sequelize.DATE,
      allowNull: false
    },
    body: {
      type: Sequelize.STRING,
      allowNull: false
    },
    current: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    gameTime: {
      type: Sequelize.STRING,
      allowNull: false,
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
playersInGame.hasOne(messages, { foreignKey: 'idPlayer', primaryKey: true });

module.exports = messages;
