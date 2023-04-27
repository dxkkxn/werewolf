const Sequelize = require('sequelize');
const db = require('./database.js');
const playersInGame = require('./playersInGame.js');
const powers = require('./powers.js');

const playersPowers = db.define(
  'playersPowers',
  {},
  { timestamps: false }
);

powers.belongsToMany(playersInGame, { foreignKey: 'power',  primaryKey: true, through: 'playersPowers' });
playersInGame.belongsToMany(powers, { foreignKey: 'idPlayer', primaryKey: true, through: 'playersPowers' });

module.exports = playersPowers;
