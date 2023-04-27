const Sequelize = require("sequelize");
const db = require("./database.js");
const playersInGame = require("./playersInGame.js");
const powers = require("./powers.js");

const playersPowers = db.define(
);
playersPowers.hasMany(players, {foreignKey: 'idGame'});

powers.belongsToMany(playersInGame, { through: 'playersPowers' });
playersInGame.belongsToMany(powers, { through: 'playersPowers' });
// TODO: add validation of powers at server level

module.exports = playersPowers;
