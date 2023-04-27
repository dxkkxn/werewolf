const Sequelize = require("sequelize");
const db = require("./database.js");

const game = db.define(
  "game",
  {
    idGame: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    minPlayers: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    maxPlayers: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 20,
    },
    durationDay: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    werewolfProbability: {
        type: Sequelize.DECIMAL,
        allowNull: true,
        defaultValue: 0.33,
    },
    infectionProbability: {
        type: Sequelize.DECIMAL,
        allowNull: true,
        defaultValue: 0.0,
        validate: {
            min: 0, 
            max: 1 
        }
    },
    sleeplessnessProbability: {
        type: Sequelize.DECIMAL,
        allowNull: true,
        defaultValue: 0.0,
        validate: {
            min: 0, 
            max: 1 
        }
    },
    clairvoyanceProbability: {
        type: Sequelize.DECIMAL,
        allowNull: true,
        defaultValue: 0.0,
        validate: {
            min: 0, 
            max: 1 
        }
    },
    spiritismProbability: {
        type: Sequelize.DECIMAL,
        allowNull: true,
        defaultValue: 0.0,
        validate: {
            min: 0, 
            max: 1 
        }
    },

    
  },
  { timestamps: false }
);
module.exports = game;
