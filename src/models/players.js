const Sequelize = require("sequelize");
const db = require("./database.js");
const games  = require("./games.js")
const users  = require("./users.js")

const players = db.define(
  "players",
    { timestamps: false }
);
players.hasOne(games, {foreignKey: 'idGame'});
games.belongsTo(players);
players.hasOne(users, {foreignKey: 'userName'});
users.belongsTo(players);

module.exports = players;
