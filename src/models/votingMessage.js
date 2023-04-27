const Sequelize = require("sequelize");
const db = require("./database.js");
const players = require("./players.js");

const votingMessages = db.define(
  "votingMessages",
  { timestamps: false }
);
votingMessages.hasOne(messages, {foreignKey: 'message', through: 'votingMessages'});
votingMessages.hasOne(playersInGame, {foreignKey: 'accused', through: 'votingMessages'});


module.exports = votingMessages;
