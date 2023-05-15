const Sequelize = require('sequelize');
const db = require('./database.js');
const playersInGame = require('./playersInGame.js');
const powers = require('./powers.js');

const playersPowers = db.define(
  'playersPowers',
  {},
  { timestamps: false }
);

powers.belongsToMany(playersInGame, { through: playersPowers, foreignKey: 'name' });
playersInGame.belongsToMany(powers, { through: playersPowers, foreignKey: 'idPlayer' });

module.exports = playersPowers;
