const Sequelize = require("sequelize");
const db = require("./database.js");
const players = require("./players.js");

const playersInGame = db.define(
  "playersInGame",
  {
    role: {
      // primaryKey: true,
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['werewolf', 'human']],
          msg: "role can only be werewolf or human"
        }
      }
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['alive', 'dead']],
          msg: "state can only be alive or dead"
        }
      }
    }
  },
  { timestamps: false }
);
playersInGame.hasOne(players, {foreignKey: 'idGame'});

module.exports = playersInGame;
