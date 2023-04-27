const Sequelize = require("sequelize");
const db = require("./database.js");
const playersInGame = require("./playersInGame.js");

const messages = db.define(
  "messages",
  {
    time: {
        type: Sequelize.DATE,
        allowNull: false,
        primaryKey: true
    },
    body: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    current: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    gameTime: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['day', 'night']],
          msg: "gameTime can only be day or night"
        }
      }
    }
  },
  { timestamps: false }
);
messages.hasOne(playersInGame, {foreignKey: 'idGame',
                          primaryKey: true});

module.exports = messages;
