const db = require('./database.js');
const games = require('./games.js');
const users = require('./users.js');

const players = db.define(
  'players',
  {},
  { timestamps: false }
);
games.belongsToMany(users, { foreignKey: 'idGame', primaryKey: true, through: 'players' });
users.belongsToMany(games, { foreignKey: 'userName', primaryKey: true, through: 'players' });

module.exports = players;
